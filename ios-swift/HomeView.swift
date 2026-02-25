import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var appState: AppState

    private let heroURL = URL(string: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA1MV6bcxpOHumqPHqXET4oNVxoOL1SvOBnWZE-M68VZvZurpsfRgF8hx7XgbNoSuUG5ELQKxhAH46bB62Y-1sbOFRKSC8o-Gu5nQqVXXKMHuHR9mzaOpcQckQDP6apLCnXhuqbY3j1B3gAb_-Dys5S_tr6U8XLy6vO0MgpKPwHTPkrTfWJsoucfgR1JalwlgAUFL8yHToGHVhwafbcXd-iGqL68ApMkmDpFUqQqCLTR6bBdgaJBwwdy6j-wqbDsJ6nKgqabGl4w")

    var body: some View {
        VStack {
            VStack(spacing: 16) {
                AsyncImage(url: heroURL) { phase in
                    switch phase {
                    case .empty:
                        ZStack {
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.gray.opacity(0.3))
                            ProgressView()
                        }
                    case .success(let image):
                        image
                            .resizable()
                            .scaledToFill()
                            .frame(height: 260)
                            .clipped()
                            .cornerRadius(16)
                            .shadow(radius: 12)
                    case .failure:
                        ZStack {
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.gray.opacity(0.3))
                            Image(systemName: "photo")
                                .foregroundColor(.white.opacity(0.7))
                                .font(.system(size: 32))
                        }
                        .frame(height: 260)
                    @unknown default:
                        EmptyView()
                    }
                }
                .padding(.horizontal)

                VStack(spacing: 8) {
                    Text("Analyze your tennis swing")
                        .font(.system(size: 28, weight: .bold))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)

                    Text("Compare your swing to the pros and get personalized tips to improve your game.")
                        .font(.system(size: 16))
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
            }

            Spacer()

            Button {
                appState.selectedTab = .upload
            } label: {
                Text("Get Started")
                    .font(.system(size: 17, weight: .bold))
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Color.green)
                    .foregroundColor(Color.black)
                    .cornerRadius(14)
                    .padding(.horizontal)
            }
            .padding(.bottom, 24)
        }
    }
}

