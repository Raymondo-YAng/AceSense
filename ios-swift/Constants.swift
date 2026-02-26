import Foundation

// Mirrors web `constants.js` shape for the native Swift UI project.
// Note: the original `lh3.googleusercontent.com/aida-public/...` links are often ephemeral
// and may fail in native AsyncImage. Use stable public HTTPS URLs here.
struct APIConfig {
    static let baseURLString = "https://api.aicoachtennis.com"
    static let baseURL = URL(string: baseURLString)!
}

enum AceSenseImages {
    private static let cosBase = "https://acesense-1402054952.cos.ap-tokyo.myqcloud.com/assets"

    static let userAvatar = URL(string: "\(cosBase)/user_avatar.png")
    static let homeHero = URL(string: "\(cosBase)/home_hero.png")
    static let analysisPlaceholder = URL(string: "\(cosBase)/analysis_video_placeholder.png")

    enum Swings {
        private static let base = AceSenseImages.cosBase
        static let forehand = URL(string: "\(base)/swing_forehand.png")
        static let backhand = URL(string: "\(base)/swing_backhand.png")
        static let serve = URL(string: "\(base)/swing_serve.png")
    }

    enum Pros {
        private static let base = AceSenseImages.cosBase
        static let federer = URL(string: "\(base)/pro_federer.png")
        static let serena = URL(string: "\(base)/pro_serena.png")
        static let nadal = URL(string: "\(base)/pro_nadal.png")
    }
}
