import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 0) {
                ScrollView {
                    VStack(spacing: 0) {
                        VStack {
                            RemoteCardImage(url: AceSenseImages.homeHero, height: 320)
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 12)

                        Text("Analyze your tennis swing")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 16)
                            .padding(.top, 20)
                            .padding(.bottom, 12)

                        Text("Compare your swing to the pros and get personalized tips to improve your game.")
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 16)
                            .padding(.top, 4)
                            .padding(.bottom, 12)
                    }
                    .frame(maxWidth: .infinity)
                }

                VStack {
                    Button {
                        appState.selectedTab = .upload
                    } label: {
                        Text("Get Started")
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 12)
            }
        }
        .background(AceColor.background.ignoresSafeArea())
    }
}
