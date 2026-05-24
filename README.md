# CopyChime

> A tiny clipboard HUD for Windows. Copy, preview, and quickly reuse recent text snippets.

## What it is

CopyChime is a lightweight clipboard HUD that shows a notification when you copy text, lets you browse recent clipboard history, and quickly re-copy previous items.

## What it is not

CopyChime is **not** a full clipboard manager like Ditto, CopyQ, or EcoPaste. It intentionally stays simple:

- No image/file clipboard history
- No rich text support
- No cloud sync or accounts
- No AI or OCR
- No network requests
- No analytics or telemetry

## Features

- **Copy notification** — Shows a bubble with text preview, character count, and line count
- **Clipboard history** — Browse and re-copy recent text snippets
- **Pin items** — Keep important clips from being auto-cleared
- **Privacy mode** — Hide clipboard content from the UI
- **Sensitive content detection** — Automatically masks API keys, tokens, passwords
- **Ignore patterns** — Skip clipboard content matching custom rules
- **Theme support** — Light, Dark, Catppuccin, Mint, Mono, System
- **System tray** — Minimize to tray, pause/resume, quick access
- **Global shortcuts** — Ctrl+Alt+C/H/P/M for quick control
- **Window position memory** — Remembers where you placed the HUD

## Privacy

CopyChime stores all data locally in your user data directory. It:

- Does **not** upload clipboard content anywhere
- Does **not** make any network requests
- Does **not** use analytics or telemetry
- Does **not** sync to cloud services

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Type Check

```bash
npm run typecheck
```

## Global Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Alt+C | Show/Hide window |
| Ctrl+Alt+H | Open history panel |
| Ctrl+Alt+P | Pause/Resume clipboard watching |
| Ctrl+Alt+M | Toggle privacy mode |

## Roadmap

- Packaging / installer
- Optional custom shortcuts
- Portable mode

## Demo

TODO: Add GIF
