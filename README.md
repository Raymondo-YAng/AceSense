<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and view AceSense

This repo now uses a simple, static multi‑page setup (HTML/CSS/JS) that loads React from a CDN. You can open the pages directly in a browser without Node.js.

View your app in AI Studio: https://ai.studio/apps/drive/1gfY6kNMlXlSYpeePiHo6Pi7P75I8flV7

## Static Multi‑Page (no Node required)

Open any of these files directly in your browser:

- `index.html` – Home
- `upload.html` – Upload
- `analysis.html` – Analysis Results
- `profile.html` – Profile

Alternatively, serve the folder with any simple HTTP server:

- Python: `python -m http.server 3000` then visit `http://localhost:3000/`
- Node (http-server): `npx http-server -p 3000` then visit `http://localhost:3000/`

## Notes

- The project is fully Node-free. No `npm install` or dev server is required.
- Pages use import maps and CDN React/Lucide; no bundling is needed.
