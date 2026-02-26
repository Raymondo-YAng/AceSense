import SwiftUI
import AVKit

struct AnalysisView: View {
    @EnvironmentObject private var appState: AppState
    @State private var player = AVPlayer()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                header

                sectionTitle("Swing Metrics")
                    .padding(.top, 8)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    metricCard(label: "Swing Speed", value: "75 mph", delta: "+5%", isPositive: true)
                    metricCard(label: "Impact Angle", value: "12°", delta: "-2%", isPositive: false)
                    metricCard(label: "Follow Through", value: "80°", delta: "+10%", isPositive: true)
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)

                sectionTitle(appState.analysisVideoHasParam ? "Your Analysis Video" : "Comparison to Pro")
                    .padding(.top, 20)

                videoSection
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                swingSpeedComparison
                    .padding(.horizontal, 16)
                    .padding(.vertical, 20)

                sectionTitle("Areas for Improvement")

                VStack(spacing: 0) {
                    improvementItem(symbol: "bolt.fill", title: "Swing Speed", description: "Focus on generating more power from your legs and core.")
                    Divider().overlay(AceColor.card.opacity(0.5))
                    improvementItem(symbol: "target", title: "Impact Angle", description: "Adjust your grip to achieve a more optimal impact angle.")
                    Divider().overlay(AceColor.card.opacity(0.5))
                    improvementItem(symbol: "arrow.right", title: "Follow Through", description: "Extend your arm fully and maintain a smooth follow-through.")
                }
                .background(AceColor.background)
                .overlay(
                    RoundedRectangle(cornerRadius: 14).stroke(AceColor.card.opacity(0.8), lineWidth: 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .padding(.horizontal, 16)
                .padding(.top, 8)

                sectionTitle("Suggested Exercises")
                    .padding(.top, 20)

                VStack(spacing: 0) {
                    exerciseItem(category: "Swing Speed", description: "Medicine Ball Throws: Develops explosive power. Shadow Swings with Resistance Band: Increases swing speed.")
                    Divider().overlay(AceColor.card.opacity(0.5))
                    exerciseItem(category: "Impact Angle", description: "Grip Adjustment Drills: Improves impact angle. Target Practice: Refines accuracy.")
                    Divider().overlay(AceColor.card.opacity(0.5))
                    exerciseItem(category: "Follow Through", description: "Smooth Follow-Through Drills: Enhances fluidity. Full Arm Extension Exercises: Improves reach.")
                }
                .background(AceColor.background)
                .overlay(
                    RoundedRectangle(cornerRadius: 14).stroke(AceColor.card.opacity(0.8), lineWidth: 1)
                )
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .padding(.horizontal, 16)
                .padding(.top, 8)
                .padding(.bottom, 24)
            }
        }
        .background(AceColor.background.ignoresSafeArea())
        .task(id: appState.analysisVideoBaseURL) {
            if appState.analysisVideoBaseURL != nil {
                appState.startPollingAnalysisVideo()
            }
        }
        .onChange(of: appState.analysisVideoPlaybackURL) { _, newValue in
            guard let newValue else { return }
            player.replaceCurrentItem(with: AVPlayerItem(url: newValue))
            if appState.analysisVideoStatus == .ready {
                player.play()
            }
        }
    }

    private var header: some View {
        HStack {
            Button {
                appState.selectedTab = .upload
            } label: {
                Image(systemName: "chevron.left")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 48, height: 48)
            }

            Spacer()

            Text("Analysis Results")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)

            Spacer()

            Color.clear.frame(width: 48, height: 48)
        }
        .padding(.horizontal, 4)
        .padding(.top, 8)
        .padding(.bottom, 4)
    }

    private func sectionTitle(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 22, weight: .bold))
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.bottom, 4)
    }

    private func metricCard(label: String, value: String, delta: String, isPositive: Bool) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white)
            Text(value)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white)
            Text(delta)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(isPositive ? AceColor.success : AceColor.danger)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(AceColor.card.opacity(0.2))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(AceColor.accent, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    @ViewBuilder
    private var videoSection: some View {
        if appState.analysisVideoHasParam {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(AceColor.card)
                if appState.analysisVideoStatus == .ready, appState.analysisVideoPlaybackURL != nil {
                    VideoPlayer(player: player)
                        .onAppear {
                            if let url = appState.analysisVideoPlaybackURL {
                                player.replaceCurrentItem(with: AVPlayerItem(url: url))
                            }
                            player.play()
                        }
                        .onDisappear { player.pause() }
                } else {
                    VStack(spacing: 8) {
                        Text("Video is being processed...")
                            .font(.body.weight(.medium))
                            .foregroundColor(.white)
                        Text("We will refresh automatically once the marked video is ready.")
                            .font(.footnote)
                            .foregroundColor(AceColor.secondary)
                            .multilineTextAlignment(.center)
                        Button {
                            appState.manualRefreshAnalysisVideo()
                        } label: {
                            Text("Refresh Now")
                                .font(.system(size: 14, weight: .bold))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(AceColor.primary)
                                .foregroundColor(AceColor.background)
                                .clipShape(Capsule())
                        }
                        .padding(.top, 4)
                    }
                    .padding(20)
                }
            }
            .frame(height: 220)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        } else {
            ZStack {
                RemoteCardImage(url: AceSenseImages.analysisPlaceholder, height: 220)
                Circle()
                    .fill(Color.black.opacity(0.4))
                    .frame(width: 64, height: 64)
                Image(systemName: "play.fill")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
            }
        }
    }

    private var swingSpeedComparison: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Swing Speed Comparison")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white)
            Text("75 mph")
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(.white)

            HStack(alignment: .bottom, spacing: 16) {
                comparisonColumn(label: "Your Swing", ratio: 0.70)
                comparisonColumn(label: "Pro Swing", ratio: 0.40)
            }
            .frame(height: 170)
            .padding(.top, 6)
        }
    }

    private func comparisonColumn(label: String, ratio: CGFloat) -> some View {
        VStack(spacing: 8) {
            GeometryReader { geo in
                VStack {
                    Spacer()
                    Rectangle()
                        .fill(AceColor.card)
                        .overlay(Rectangle().fill(AceColor.secondary).frame(height: 2), alignment: .top)
                        .frame(height: geo.size.height * ratio)
                }
            }
            Text(label)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(AceColor.secondary)
        }
        .frame(maxWidth: .infinity)
    }

    private func improvementItem(symbol: String, title: String, description: String) -> some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 10).fill(AceColor.card)
                Image(systemName: symbol)
                    .foregroundColor(.white)
            }
            .frame(width: 44, height: 44)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white)
                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(AceColor.secondary)
            }

            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }

    private func exerciseItem(category: String, description: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 10).fill(AceColor.card)
                Image(systemName: "dumbbell.fill")
                    .foregroundColor(.white)
            }
            .frame(width: 44, height: 44)

            VStack(alignment: .leading, spacing: 3) {
                Text("Exercises")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white)
                Text(category)
                    .font(.system(size: 14))
                    .foregroundColor(AceColor.secondary)
                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(AceColor.secondary.opacity(0.9))
            }

            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }
}
