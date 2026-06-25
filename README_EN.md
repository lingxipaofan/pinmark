# Startmark

Your bookmarks as a new tab page. Masonry layout, drag-and-drop ordering synced to Chrome.

## Highlights

- **Masonry layout** — Bookmarks grouped by folder in a multi-column waterfall, naturally filling gaps.
- **Drag-and-drop sort** — Reorder bookmarks by dragging. Changes write directly to Chrome's native bookmark order, cross-folder moves included.
- **Inline edit dialog** — Rename, edit URLs, or create folders via modal dialogs — no browser `prompt()`.
- **Smart title cleanup** — Auto-hides notification badges, duplicate site names, and redundant suffixes.
- **Rich context menu** — Open in incognito / tab group, batch open all in a folder, rename/delete folders.
- **UI zoom** — Adjustable 75%–125% scale, persisted locally.
- **Root folder toggle** — Show or hide "Bookmarks bar" and "Other bookmarks" as top-level blocks.
- **Broken link detection** — One-click scan with unobtrusive broken-link markers.

## Development

```bash
npm ci
npm run dev
npm run build
npm test
```

Stack: WXT · React · TypeScript · Vite

## Install

Build then load `.output/chrome-mv3` as an unpacked extension at `chrome://extensions/` (Developer mode required).

## Roadmap

- [ ] Improve folder drag-and-drop UX
- [ ] Support hiding specific folders

## Credits

Forked from [pinmark](https://github.com/lingxipaofan/pinmark), MIT licensed.
