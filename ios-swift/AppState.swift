import Foundation
import SwiftUI

enum AceSenseTab: Hashable {
    case home
    case upload
    case analysis
    case profile
}

final class AppState: ObservableObject {
    @Published var selectedTab: AceSenseTab = .home
    @Published var analysisVideoURL: URL?
    @Published var isLoggedIn: Bool = false
    @Published var accessToken: String?
}

