import SwiftUI
import AVKit

struct AnalysisView: View {
    @EnvironmentObject private var appState: AppState
    @State private var videoError = false

    private var player: AVPlayer? {
        guard let url = appState.analysisVideoURL else { return nil }
        return AVPlayer(url: url)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Swing Metrics")
                    .font(.title2.weight(.bold))
                    .padding(.horizontal)

                metricRow

                Text(appState.analysisVideoURL == nil ? "Comparison to Pro" : "Your Analysis Video")
                    .font(.title2.weight(.bold))
                    .padding(.horizontal)

                videoSection

                swingSpeedSection

                Text("Areas for Improvement")
                    .font(.title2.weight(.bold))
                    .padding(.horizontal)

                improvementList

                Text("Suggested Exercises")
                    .font(.title2.weight(.bold))
                    .padding(.horizontal)

                exerciseList
            }
            .padding(.vertical)
        }
        .navigationTitle("Analysis Results")
    }

    private var metricRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                metricCard(label: "Swing Speed", value: "75 mph", delta: "+5%", isPositive: true)
                metricCard(label: "Impact Angle", value: "12°", delta: "-2%", isPositive: false)
                metricCard(label: "Follow Through", value: "80°", delta: "+10%", isPositive: true)
            }
            .padding(.horizontal)
        }
    }

    private func metricCard(label: String, value: String, delta: String, isPositive: Bool) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.body.weight(.medium))
            Text(value)
                .font(.title3.weight(.bold))
            Text(delta)
                .font(.subheadline.weight(.medium))
                .foregroundColor(isPositive ? .green : .red)
        }
        .padding()
        .frame(minWidth: 160)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }

    private var videoSection: some View {
        Group {
            if let player, !videoError {
                VideoPlayer(player: player)
                    .frame(height: 220)
                    .cornerRadius(12)
                    .padding(.horizontal)
            } else {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color(.secondarySystemBackground))
                    VStack(spacing: 8) {
                        if videoError {
                            Text("Video is being processed...")
                                .font(.body.weight(.medium))
                            Text("Please wait a few seconds and rerun the view.")
                                .font(.footnote)
                                .foregroundColor(.secondary)
                        } else {
                            Text("No video yet")
                                .font(.body.weight(.medium))
                            Text("Upload a swing to see your marked analysis video here.")
                                .font(.footnote)
                                .foregroundColor(.secondary)
                        }
                    }
                    .multilineTextAlignment(.center)
                    .padding()
                }
                .frame(height: 220)
                .padding(.horizontal)
            }
        }
    }

    private var swingSpeedSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Swing Speed Comparison")
                .font(.body.weight(.medium))
            Text("75 mph")
                .font(.system(size: 32, weight: .bold))

            HStack(alignment: .bottom, spacing: 32) {
                VStack {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color(.secondarySystemBackground))
                        .frame(height: 140)
                    Text("Your Swing")
                        .font(.caption.weight(.bold))
                        .foregroundColor(.secondary)
                }
                VStack {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color(.secondarySystemBackground))
                        .frame(height: 80)
                    Text("Pro Swing")
                        .font(.caption.weight(.bold))
                        .foregroundColor(.secondary)
                }
            }
            .padding(.top, 8)
        }
        .padding(.horizontal)
    }

    private var improvementList: some View {
        VStack(spacing: 0) {
            improvementItem(title: "Swing Speed", description: "Focus on generating more power from your legs and core.")
            Divider()
            improvementItem(title: "Impact Angle", description: "Adjust your grip to achieve a more optimal impact angle.")
            Divider()
            improvementItem(title: "Follow Through", description: "Extend your arm fully and maintain a smooth follow-through.")
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .padding(.horizontal)
    }

    private func improvementItem(title: String, description: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "bolt.fill")
                .frame(width: 40, height: 40)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(10)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.body.weight(.medium))
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding(12)
    }

    private var exerciseList: some View {
        VStack(spacing: 0) {
            exerciseItem(category: "Swing Speed", description: "Medicine Ball Throws and shadow swings with a resistance band to develop explosive power and speed.")
            Divider()
            exerciseItem(category: "Impact Angle", description: "Grip adjustment drills and target practice to refine your impact angle and accuracy.")
            Divider()
            exerciseItem(category: "Follow Through", description: "Smooth follow-through drills and full arm extension exercises to improve reach and fluidity.")
        }
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .padding(.horizontal)
    }

    private func exerciseItem(category: String, description: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "dumbbell.fill")
                .frame(width: 40, height: 40)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(10)

            VStack(alignment: .leading, spacing: 4) {
                Text(category)
                    .font(.body.weight(.medium))
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding(12)
    }
}

