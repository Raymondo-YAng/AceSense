# COS Image URL Mapping (for `ios-swift/Constants.swift`)

Upload the exported PNG files to Tencent Cloud COS, then fill in the public URLs below and send them back.

## Expected filenames (from `scripts/export_web_constants_images.sh`)

- `user_avatar.png`
- `home_hero.png`
- `analysis_video_placeholder.png`
- `swing_forehand.png`
- `swing_backhand.png`
- `swing_serve.png`
- `pro_federer.png`
- `pro_serena.png`
- `pro_nadal.png`

## Reply format (copy/paste and fill)

```text
user_avatar=https://...
home_hero=https://...
analysis_video_placeholder=https://...
swing_forehand=https://...
swing_backhand=https://...
swing_serve=https://...
pro_federer=https://...
pro_serena=https://...
pro_nadal=https://...
```

Once you send these URLs, I can patch `/Users/lihe8811/Desktop/AceSense/ios-swift/Constants.swift` to use the COS-hosted images and restore exact web assets in Swift.
