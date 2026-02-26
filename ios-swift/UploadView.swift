import SwiftUI
import UniformTypeIdentifiers
#if os(macOS)
import AppKit
#endif

struct UploadView: View {
    @EnvironmentObject private var appState: AppState

    @State private var showImporter = false
    @State private var alertMessage: String?

    var body: some View {
        VStack(spacing: 0) {
            header

            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Text("Upload your swing")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.top, 20)
                        .padding(.bottom, 8)

                    Text("Upload a video of your tennis swing to get started. Make sure the video is clear and shows your full swing.")
                        .font(.system(size: 16))
                        .foregroundColor(.white.opacity(0.9))
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.bottom, 12)
                        .padding(.bottom, 4)

                    if let alertMessage {
                        Text(alertMessage)
                            .font(.footnote)
                            .foregroundColor(AceColor.danger)
                            .padding(.bottom, 12)
                    }

                    VStack(spacing: 12) {
                        Button {
                            presentVideoPicker()
                        } label: {
                            Text(appState.isUploading ? "Uploading and processing..." : "Upload from library")
                        }
                        .buttonStyle(PrimaryButtonStyle())
                        .disabled(appState.isUploading)

                        Button {
                            presentVideoPicker()
                        } label: {
                            Text("Record a new video")
                        }
                        .buttonStyle(SecondaryButtonStyle())
                        .disabled(appState.isUploading)
                    }
                    .padding(.top, 8)
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .background(AceColor.background.ignoresSafeArea())
        .fileImporter(
            isPresented: $showImporter,
            allowedContentTypes: [.movie, .mpeg4Movie]
        ) { result in
            switch result {
            case .success(let fileURL):
                Task {
                    let didAccess = fileURL.startAccessingSecurityScopedResource()
                    defer { if didAccess { fileURL.stopAccessingSecurityScopedResource() } }
                    do {
                        alertMessage = nil
                        try await appState.uploadVideo(fileURL: fileURL)
                    } catch {
                        alertMessage = error.localizedDescription
                    }
                }
            case .failure(let error):
                alertMessage = error.localizedDescription
            }
        }
    }

    private func presentVideoPicker() {
#if os(macOS)
        let panel = NSOpenPanel()
        panel.canChooseFiles = true
        panel.canChooseDirectories = false
        panel.allowsMultipleSelection = false
        panel.allowedContentTypes = [.movie, .mpeg4Movie]
        panel.prompt = "Select Video"

        let response = panel.runModal()
        if response == .OK, let fileURL = panel.url {
            Task {
                do {
                    alertMessage = nil
                    try await appState.uploadVideo(fileURL: fileURL)
                } catch {
                    alertMessage = error.localizedDescription
                }
            }
        }
#else
        showImporter = true
#endif
    }

    private var header: some View {
        HStack {
            Button {
                appState.selectedTab = .home
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 48, height: 48)
                    .contentShape(Rectangle())
            }

            Spacer()

            Text("Upload")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)

            Spacer()

            Color.clear.frame(width: 48, height: 48)
        }
        .padding(.horizontal, 4)
        .padding(.top, 8)
        .padding(.bottom, 4)
    }
}
