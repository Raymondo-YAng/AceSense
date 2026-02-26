import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var appState: AppState

    @State private var username: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String?
    @State private var isLoading = false

    var body: some View {
        Group {
            if !appState.isLoggedIn {
                loginView
            } else {
                profileContent
            }
        }
    }

    private var loginView: some View {
        VStack(spacing: 24) {
            Text("Login")
                .font(.title.weight(.bold))

            if let errorMessage {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .font(.footnote)
                    .multilineTextAlignment(.center)
            }

            VStack(spacing: 12) {
                TextField("Username", text: $username)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(10)

                SecureField("Password", text: $password)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(10)
            }

            Button {
                Task {
                    await login()
                }
            } label: {
                Text(isLoading ? "Logging in..." : "Login")
                    .font(.system(size: 17, weight: .bold))
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(isLoading ? Color.gray : Color.green)
                    .foregroundColor(.black)
                    .cornerRadius(14)
            }
            .disabled(isLoading || username.isEmpty || password.isEmpty)

            Spacer()
        }
        .padding()
    }

    private var profileContent: some View {
        ScrollView {
            VStack(spacing: 24) {
                VStack(spacing: 12) {
                    Circle()
                        .fill(Color(.secondarySystemBackground))
                        .frame(width: 120, height: 120)
                        .overlay(
                            Image(systemName: "person.fill")
                                .font(.system(size: 48))
                                .foregroundColor(.white)
                        )
                    VStack(spacing: 4) {
                        Text("Ethan Carter")
                            .font(.title2.weight(.bold))
                        Text("Pro Tennis Player")
                            .foregroundColor(.secondary)
                        Text("Joined 2022")
                            .foregroundColor(.secondary)
                    }
                }

                HStack(spacing: 12) {
                    statCard(value: "120", label: "Swings Analyzed")
                    statCard(value: "85%", label: "Accuracy")
                    statCard(value: "4.8", label: "Avg. Rating")
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("Recent Analysis")
                        .font(.title3.weight(.bold))
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            analysisCard(title: "Forehand Swing", date: "2024-07-20")
                            analysisCard(title: "Backhand Swing", date: "2024-07-15")
                            analysisCard(title: "Serve", date: "2024-07-10")
                        }
                    }
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text("Pro Swings Library")
                        .font(.title3.weight(.bold))
                    HStack(spacing: 12) {
                        proCard(name: "Roger Federer")
                        proCard(name: "Serena Williams")
                        proCard(name: "Rafael Nadal")
                    }
                }

                Button(role: .destructive) {
                    appState.isLoggedIn = false
                    appState.accessToken = nil
                } label: {
                    Text("Log Out")
                        .font(.system(size: 15, weight: .bold))
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color(.secondarySystemBackground))
                        .foregroundColor(.red)
                        .cornerRadius(12)
                }
            }
            .padding()
        }
    }

    private func statCard(value: String, label: String) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.weight(.bold))
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }

    private func analysisCard(title: String, date: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.secondarySystemBackground))
                .frame(width: 120, height: 160)
            Text(title)
                .font(.body.weight(.medium))
            Text(date)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    private func proCard(name: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(.secondarySystemBackground))
                .frame(width: 100, height: 140)
            Text(name)
                .font(.body.weight(.medium))
        }
    }

    private func login() async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        let backendURL = "http://localhost:8000"
        guard let url = URL(string: "\(backendURL)/token") else {
            errorMessage = "Invalid backend URL."
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        let bodyString = "username=\(username)&password=\(password)"
        request.httpBody = bodyString.data(using: .utf8)

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let http = response as? HTTPURLResponse else {
                errorMessage = "Invalid response."
                return
            }

            guard (200..<300).contains(http.statusCode) else {
                if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let detail = json["detail"] as? String {
                    errorMessage = detail
                } else {
                    errorMessage = "Login failed with status \(http.statusCode)."
                }
                return
            }

            if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let token = json["access_token"] as? String {
                appState.accessToken = token
                appState.isLoggedIn = true
            } else {
                errorMessage = "Unexpected response format."
            }
        } catch {
            errorMessage = "Network error: \(error.localizedDescription)"
        }
    }
}

