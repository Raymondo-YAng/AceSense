import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var appState: AppState

    @State private var authMode: AuthMode = .login
    @State private var username = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errorMessage = ""
    @State private var successMessage = ""
    @State private var isSubmitting = false

    var body: some View {
        Group {
            if appState.isLoggedIn {
                profileContent
            } else {
                authView
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AceColor.background.ignoresSafeArea())
    }

    private var authView: some View {
        VStack {
            VStack(spacing: 0) {
                HStack(spacing: 8) {
                    authModeButton(.login, title: "Login")
                    authModeButton(.register, title: "Register")
                }
                .padding(4)
                .background(AceColor.background.opacity(0.4))
                .clipShape(Capsule())
                .padding(.bottom, 20)

                Text(authMode == .login ? "Welcome back" : "Create your account")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.bottom, 14)

                if !errorMessage.isEmpty {
                    Text(errorMessage)
                        .font(.footnote)
                        .foregroundColor(AceColor.danger)
                        .multilineTextAlignment(.center)
                        .padding(.bottom, 12)
                }

                if !successMessage.isEmpty {
                    Text(successMessage)
                        .font(.footnote)
                        .foregroundColor(AceColor.success)
                        .multilineTextAlignment(.center)
                        .padding(.bottom, 12)
                }

                VStack(spacing: 12) {
                    authTextField("Username", text: $username)

                    if authMode == .register {
                        authTextField("Email", text: $email)
                    }

                    authSecureField("Password", text: $password)

                    if authMode == .register {
                        authSecureField("Confirm Password", text: $confirmPassword)
                    }
                }

                Button {
                    Task { await submitAuth() }
                } label: {
                    Text(buttonTitle)
                }
                .buttonStyle(PrimaryButtonStyle())
                .padding(.top, 16)
                .disabled(isSubmitting)
            }
            .padding(24)
            .frame(maxWidth: 420)
            .background(AceColor.card)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.25), radius: 12, y: 4)
            .padding()
        }
    }

    private var profileContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Spacer()
                    Text("Profile")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                    Button {
                        appState.logout()
                        resetMessages()
                        password = ""
                        confirmPassword = ""
                    } label: {
                        Text("Logout")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .frame(width: 56, alignment: .trailing)
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
                .padding(.bottom, 4)

                VStack(spacing: 16) {
                    AsyncCircleAvatar(url: AceSenseImages.userAvatar)
                    VStack(spacing: 4) {
                        Text(appState.profileData?.username ?? "Your Name")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.white)
                        Text("AceSense Member")
                            .font(.system(size: 16))
                            .foregroundColor(AceColor.secondary)
                        Text("Joined 2026")
                            .font(.system(size: 16))
                            .foregroundColor(AceColor.secondary)
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 12)
                .padding(.bottom, 12)

                HStack(spacing: 10) {
                    statCard(value: "120", label: "Swings Analyzed")
                    statCard(value: "85%", label: "Accuracy")
                    statCard(value: "4.8", label: "Avg. Rating")
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)

                sectionTitle("Recent Analysis")
                    .padding(.top, 12)

                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHStack(spacing: 12) {
                        analysisCard(imageURL: AceSenseImages.Swings.forehand, title: "Forehand Swing", date: "2024-07-20")
                        analysisCard(imageURL: AceSenseImages.Swings.backhand, title: "Backhand Swing", date: "2024-07-15")
                        analysisCard(imageURL: AceSenseImages.Swings.serve, title: "Serve", date: "2024-07-10")
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 8)
                }

                sectionTitle("Pro Swings Library")
                    .padding(.top, 12)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    proCard(imageURL: AceSenseImages.Pros.federer, name: "Roger Federer")
                    proCard(imageURL: AceSenseImages.Pros.serena, name: "Serena Williams")
                    proCard(imageURL: AceSenseImages.Pros.nadal, name: "Rafael Nadal")
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 24)
            }
        }
    }

    private func authModeButton(_ mode: AuthMode, title: String) -> some View {
        Button {
            authMode = mode
            resetMessages()
        } label: {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(authMode == mode ? AceColor.background : AceColor.secondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(authMode == mode ? AceColor.primary : Color.clear)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    private func authTextField(_ placeholder: String, text: Binding<String>) -> some View {
        TextField(placeholder, text: text)
            .padding(12)
            .background(AceColor.surface)
            .foregroundColor(Color.white)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(AceColor.accent, lineWidth: 1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private func authSecureField(_ placeholder: String, text: Binding<String>) -> some View {
        SecureField(placeholder, text: text)
            .padding(12)
            .background(AceColor.surface)
            .foregroundColor(Color.white)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(AceColor.accent, lineWidth: 1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private var buttonTitle: String {
        if isSubmitting { return authMode == .login ? "Logging in..." : "Creating account..." }
        return authMode == .login ? "Login" : "Create Account"
    }

    private func resetMessages() {
        errorMessage = ""
        successMessage = ""
    }

    private func submitAuth() async {
        resetMessages()
        isSubmitting = true
        defer { isSubmitting = false }

        do {
            if authMode == .login {
                try await appState.login(username: username, password: password)
            } else {
                guard password == confirmPassword else {
                    errorMessage = "Passwords do not match"
                    return
                }
                try await appState.register(username: username, email: email, password: password)
                successMessage = "Account created successfully. Please log in."
                authMode = .login
                password = ""
                confirmPassword = ""
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func sectionTitle(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 22, weight: .bold))
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.bottom, 4)
    }

    private func statCard(value: String, label: String) -> some View {
        VStack(spacing: 6) {
            Text(value)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white)
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(AceColor.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .padding(.horizontal, 8)
        .background(AceColor.card.opacity(0.2))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(AceColor.accent, lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func analysisCard(imageURL: URL?, title: String, date: String) -> some View {
        let cardWidth: CGFloat = 118
        let imageHeight: CGFloat = 150

        return VStack(alignment: .leading, spacing: 8) {
            RemoteCardImage(url: imageURL, height: imageHeight, title: title)
                .frame(width: cardWidth, height: imageHeight)
                .clipped()
            Text(title)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white)
                .lineLimit(1)
                .truncationMode(.tail)
                .frame(width: cardWidth, alignment: .leading)
            Text(date)
                .font(.system(size: 12))
                .foregroundColor(AceColor.secondary)
                .frame(width: cardWidth, alignment: .leading)
        }
        .frame(width: cardWidth, alignment: .leading)
        .contentShape(Rectangle())
        .clipped()
    }

    private func proCard(imageURL: URL?, name: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            RemoteCardImage(url: imageURL, height: 170, title: name)
            Text(name)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white)
                .lineLimit(1)
        }
    }
}
