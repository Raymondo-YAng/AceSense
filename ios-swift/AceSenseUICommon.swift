import SwiftUI

struct AceColor {
    static let background = Color(hex: 0x111813)
    static let surface = Color(hex: 0x1C271F)
    static let card = Color(hex: 0x28392E)
    static let primary = Color(hex: 0x13EC5B)
    static let secondary = Color(hex: 0x9DB9A6)
    static let accent = Color(hex: 0x3B5443)
    static let success = Color(hex: 0x0BDA43)
    static let danger = Color(hex: 0xFA5538)
}

extension Color {
    init(hex: UInt32, opacity: Double = 1) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(.sRGB, red: r, green: g, blue: b, opacity: opacity)
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 17, weight: .bold))
            .foregroundColor(.black)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity)
            .background(AceColor.primary.opacity(configuration.isPressed ? 0.85 : 1))
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 17, weight: .bold))
            .foregroundColor(.white)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity)
            .background(AceColor.card.opacity(configuration.isPressed ? 0.75 : 1))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(AceColor.accent, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct RemoteCardImage: View {
    let url: URL?
    let height: CGFloat
    var title: String? = nil

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .fill(AceColor.card)
            AsyncImage(url: url) { phase in
                switch phase {
                case .success(let image):
                    image.resizable().scaledToFill()
                case .empty:
                    placeholder(isLoading: true)
                default:
                    placeholder(isLoading: false)
                }
            }
        }
        .frame(height: height)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    @ViewBuilder
    private func placeholder(isLoading: Bool) -> some View {
        ZStack {
            LinearGradient(colors: [AceColor.card, AceColor.surface, AceColor.accent.opacity(0.9)], startPoint: .topLeading, endPoint: .bottomTrailing)
            VStack(spacing: 8) {
                if isLoading {
                    ProgressView().tint(AceColor.primary)
                } else {
                    Image(systemName: "photo")
                        .font(.title2)
                        .foregroundColor(.white.opacity(0.9))
                }
                if let title, !title.isEmpty {
                    Text(title)
                        .font(.caption.weight(.semibold))
                        .foregroundColor(AceColor.secondary)
                        .lineLimit(1)
                }
            }
            .padding(10)
        }
    }
}

struct AsyncCircleAvatar: View {
    let url: URL?

    var body: some View {
        AsyncImage(url: url) { phase in
            switch phase {
            case .success(let image):
                image.resizable().scaledToFill()
            default:
                ZStack {
                    Circle().fill(AceColor.card)
                    Image(systemName: "person.fill")
                        .font(.system(size: 42))
                        .foregroundColor(.white)
                }
            }
        }
        .frame(width: 128, height: 128)
        .clipShape(Circle())
        .overlay(Circle().stroke(AceColor.card, lineWidth: 4))
    }
}

struct CardChrome: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(AceColor.card.opacity(0.35))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(AceColor.accent, lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

extension View {
    func aceCardChrome() -> some View { modifier(CardChrome()) }
}
