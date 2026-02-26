import SwiftUI

struct AceSenseRootView: View {
    @StateObject private var appState = AppState()

    var body: some View {
        TabView(selection: $appState.selectedTab) {
            HomeView()
                .environmentObject(appState)
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag(AceSenseTab.home)

            UploadView()
                .environmentObject(appState)
                .tabItem { Label("Upload", systemImage: "plus.square") }
                .tag(AceSenseTab.upload)

            AnalysisView()
                .environmentObject(appState)
                .tabItem { Label("Analysis", systemImage: "magnifyingglass") }
                .tag(AceSenseTab.analysis)

            ProfileView()
                .environmentObject(appState)
                .tabItem { Label("Profile", systemImage: "person") }
                .tag(AceSenseTab.profile)
        }
        .tint(AceColor.primary)
        .preferredColorScheme(.dark)
        .background(AceColor.background)
    }
}
