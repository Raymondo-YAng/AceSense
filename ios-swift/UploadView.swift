import SwiftUI

struct UploadView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isUploading = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text("Upload your swing")
                    .font(.title2.weight(.bold))

                Text("Upload a video of your tennis swing to get started. Make sure the video is clear and shows your full swing.")
                    .font(.body)
                    .foregroundColor(.secondary)

                if let errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .font(.footnote)
                }

                Spacer()

                VStack(spacing: 12) {
                    Button {
                        simulateUpload()
                    } label: {
                        Text(isUploading ? "Uploading and processing..." : "Upload from library")
                            .font(.system(size: 17, weight: .bold))
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(isUploading ? Color.gray : Color.green)
                            .foregroundColor(.black)
                            .cornerRadius(14)
                    }
                    .disabled(isUploading)

                    Button {
                        simulateUpload()
                    } label: {
                        Text("Record a new video")
                            .font(.system(size: 17, weight: .bold))
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(Color(.secondarySystemBackground))
                            .foregroundColor(.white)
                            .cornerRadius(14)
                    }
                    .disabled(isUploading)
                }
            }
            .padding()
            .navigationTitle("Upload")
        }
    }

    private func simulateUpload() {
        errorMessage = nil
        isUploading = true

        // In a full iOS app you would:
        // 1. Let the user pick or record a video.
        // 2. Upload it to http://localhost:8000/upload-video as multipart/form-data.
        // 3. Read the marked_url from the JSON response and store it in appState.analysisVideoURL.

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            // For now we just navigate to the Analysis tab.
            self.isUploading = false
            self.appState.selectedTab = .analysis
        }
    }
}

