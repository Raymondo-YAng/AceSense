import Foundation
import Combine

enum AceSenseTab: Hashable {
    case home
    case upload
    case analysis
    case profile
}

enum AuthMode: String {
    case login
    case register
}

enum AnalysisVideoStatus {
    case idle
    case processing
    case ready
}

struct StoredProfileData: Codable {
    let username: String
}

@MainActor
final class AppState: ObservableObject {
    @Published var selectedTab: AceSenseTab = .home

    @Published var analysisVideoBaseURL: URL?
    @Published var analysisVideoStatus: AnalysisVideoStatus = .idle
    @Published var analysisVideoHasParam = false
    @Published var analysisVideoRefreshToken = UUID().uuidString

    @Published var isLoggedIn = false
    @Published var accessToken: String?
    @Published var profileData: StoredProfileData?

    @Published var isUploading = false

    private var videoPollingTask: Task<Void, Never>?

    init() {
        restoreAuthFromDefaults()
    }

    var analysisVideoPlaybackURL: URL? {
        guard var components = analysisVideoBaseURL.flatMap({ URLComponents(url: $0, resolvingAgainstBaseURL: false) }) else {
            return nil
        }
        var items = components.queryItems ?? []
        items.removeAll { $0.name == "cacheBust" }
        items.append(URLQueryItem(name: "cacheBust", value: analysisVideoRefreshToken))
        components.queryItems = items
        return components.url
    }

    func login(username: String, password: String) async throws {
        var request = URLRequest(url: APIConfig.baseURL.appendingPathComponent("token"))
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = formURLEncoded(["username": username, "password": password])

        let (data, response) = try await URLSession.shared.data(for: request)
        try ensureSuccess(response: response, data: data)

        guard
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let token = json["access_token"] as? String
        else {
            throw NSError(domain: "AceSense", code: -1, userInfo: [NSLocalizedDescriptionKey: "Unexpected login response format."])
        }

        accessToken = token
        isLoggedIn = true
        let profile = StoredProfileData(username: username)
        profileData = profile
        persistAuth(token: token, profile: profile)
    }

    func register(username: String, email: String, password: String) async throws {
        var request = URLRequest(url: APIConfig.baseURL.appendingPathComponent("users/"))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: [
            "username": username,
            "email": email,
            "password": password,
        ])

        let (data, response) = try await URLSession.shared.data(for: request)
        try ensureSuccess(response: response, data: data)
    }

    func logout() {
        accessToken = nil
        isLoggedIn = false
        profileData = nil
        UserDefaults.standard.removeObject(forKey: "access_token")
        UserDefaults.standard.removeObject(forKey: "profile_data")
    }

    func uploadVideo(fileURL: URL) async throws {
        guard let fileData = try? Data(contentsOf: fileURL) else {
            throw NSError(domain: "AceSense", code: -2, userInfo: [NSLocalizedDescriptionKey: "Could not read selected file."])
        }

        isUploading = true
        defer { isUploading = false }

        let boundary = "Boundary-\(UUID().uuidString)"
        var request = URLRequest(url: APIConfig.baseURL.appendingPathComponent("upload-video"))
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        let filename = fileURL.lastPathComponent.isEmpty ? "swing.mov" : fileURL.lastPathComponent
        let mimeType = mimeTypeForVideo(filename)
        request.httpBody = makeMultipart(boundary: boundary, fieldName: "file", filename: filename, mimeType: mimeType, fileData: fileData)

        let (data, response) = try await URLSession.shared.data(for: request)
        try ensureSuccess(response: response, data: data)

        guard
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let markedURL = json["marked_url"] as? String
        else {
            throw NSError(domain: "AceSense", code: -3, userInfo: [NSLocalizedDescriptionKey: "Unexpected upload response format."])
        }

        setAnalysisVideo(relativeOrAbsoluteURL: markedURL)
        selectedTab = .analysis
    }

    func setAnalysisVideo(relativeOrAbsoluteURL raw: String) {
        analysisVideoHasParam = true
        if let absolute = URL(string: raw), absolute.scheme != nil {
            analysisVideoBaseURL = absolute
        } else {
            let trimmed = raw.hasPrefix("/") ? String(raw.dropFirst()) : raw
            analysisVideoBaseURL = APIConfig.baseURL.appendingPathComponent(trimmed)
        }
        analysisVideoStatus = .processing
        refreshAnalysisVideoCacheBust()
        startPollingAnalysisVideo()
    }

    func manualRefreshAnalysisVideo() {
        guard analysisVideoBaseURL != nil else { return }
        analysisVideoStatus = .processing
        refreshAnalysisVideoCacheBust()
        startPollingAnalysisVideo(forceRestart: true)
    }

    func startPollingAnalysisVideo(forceRestart: Bool = false) {
        guard analysisVideoBaseURL != nil else { return }
        if forceRestart {
            videoPollingTask?.cancel()
            videoPollingTask = nil
        }
        guard videoPollingTask == nil else { return }

        videoPollingTask = Task { [weak self] in
            guard let self else { return }
            while !Task.isCancelled {
                let ready = await self.checkCurrentAnalysisVideoReady()
                if ready {
                    self.analysisVideoStatus = .ready
                    self.refreshAnalysisVideoCacheBust()
                    self.videoPollingTask = nil
                    return
                }
                self.analysisVideoStatus = .processing
                self.refreshAnalysisVideoCacheBust()
                try? await Task.sleep(nanoseconds: 3_000_000_000)
            }
        }
    }

    func clearAnalysisVideo() {
        videoPollingTask?.cancel()
        videoPollingTask = nil
        analysisVideoBaseURL = nil
        analysisVideoStatus = .idle
        analysisVideoHasParam = false
    }

    private func checkCurrentAnalysisVideoReady() async -> Bool {
        guard let url = analysisVideoBaseURL else { return false }
        var request = URLRequest(url: url)
        request.httpMethod = "HEAD"
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            guard let http = response as? HTTPURLResponse else { return false }
            return (200..<300).contains(http.statusCode)
        } catch {
            return false
        }
    }

    private func refreshAnalysisVideoCacheBust() {
        analysisVideoRefreshToken = String(Int(Date().timeIntervalSince1970 * 1000))
    }

    private func ensureSuccess(response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else {
            throw NSError(domain: "AceSense", code: -10, userInfo: [NSLocalizedDescriptionKey: "Invalid response."])
        }
        guard (200..<300).contains(http.statusCode) else {
            let message = (try? JSONSerialization.jsonObject(with: data) as? [String: Any]).flatMap { $0["detail"] as? String }
                ?? "Request failed with status \(http.statusCode)."
            throw NSError(domain: "AceSense", code: http.statusCode, userInfo: [NSLocalizedDescriptionKey: message])
        }
    }

    private func formURLEncoded(_ values: [String: String]) -> Data? {
        let body = values.map { key, value in
            "\(percentEncode(key))=\(percentEncode(value))"
        }
        .joined(separator: "&")
        return body.data(using: .utf8)
    }

    private func percentEncode(_ string: String) -> String {
        string.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? string
    }

    private func persistAuth(token: String, profile: StoredProfileData) {
        UserDefaults.standard.set(token, forKey: "access_token")
        if let data = try? JSONEncoder().encode(profile) {
            UserDefaults.standard.set(data, forKey: "profile_data")
        }
    }

    private func restoreAuthFromDefaults() {
        let defaults = UserDefaults.standard
        guard let token = defaults.string(forKey: "access_token") else { return }
        accessToken = token
        isLoggedIn = true
        if let profileBlob = defaults.data(forKey: "profile_data"),
           let profile = try? JSONDecoder().decode(StoredProfileData.self, from: profileBlob) {
            profileData = profile
        }
    }

    private func mimeTypeForVideo(_ filename: String) -> String {
        let ext = filename.split(separator: ".").last?.lowercased() ?? ""
        switch ext {
        case "mp4": return "video/mp4"
        case "mov": return "video/quicktime"
        case "m4v": return "video/x-m4v"
        default: return "video/*"
        }
    }

    private func makeMultipart(boundary: String, fieldName: String, filename: String, mimeType: String, fileData: Data) -> Data {
        var body = Data()
        let lineBreak = "\r\n"
        body.append("--\(boundary)\(lineBreak)")
        body.append("Content-Disposition: form-data; name=\"\(fieldName)\"; filename=\"\(filename)\"\(lineBreak)")
        body.append("Content-Type: \(mimeType)\(lineBreak)\(lineBreak)")
        body.append(fileData)
        body.append(lineBreak)
        body.append("--\(boundary)--\(lineBreak)")
        return body
    }

}

private extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
}
