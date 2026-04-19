# Upload & Transcribe (Conectta fork)

Two features live above the stock CloudCLI UI in this fork:

1. **Voice-to-text** in the chat composer (mic button → MediaRecorder → fal.ai Wizper → caret-insert).
2. **Document upload** in the chat composer (drag-drop or paperclip → saved under `<project>/docs/uploaded/` → `@mention` inserted at caret).

## Transcribe

- Endpoint: `POST /api/projects/:projectName/transcribe` (auth'd, multipart, field `audio`).
- Server proxies to `https://fal.run/fal-ai/wizper` using `FAL_KEY` from env.
- Max upload: 25 MB; browser records WebM/Opus via `MediaRecorder`.
- UI: mic button (left of textarea) with three states — idle / recording-pulse / transcribing-spinner. Transcript is inserted at the textarea caret (not appended blindly).

### Setup

Add to `.env`:

```
FAL_KEY=<your fal.ai key>
```

## Document upload

- Endpoint: `POST /api/projects/:projectName/upload-document` (auth'd, multipart, field `files`, up to 10).
- Files land in `<project.path>/docs/uploaded/<timestamp>-<safe-name>`.
- Allowed extensions: `.pdf .docx .epub .xlsx .xls .pptx .odt .rtf .txt .md .csv`.
- Per-file cap: 50 MB.
- Response: `{ documents: [{ name, originalName, size, mimeType, relativePath, mention }] }` where `mention` is `@docs/uploaded/<name>` and is auto-inserted at the caret.

### Why `<project>/docs/uploaded/`?

Keeps every artifact the agent needs in one place next to the project — easy to grep, easy to clean up, survives without special server-side state.

## Text extraction from uploaded documents

The `@mention` inserted into chat points Claude at the binary. Claude must then extract text to answer, without loading the raw binary into its context window. We ship **skills** under `skills/` that teach it which CLI tool to use per extension.

### Install skills into your Claude Code user dir

```
./scripts/install-skills.sh
```

Installs (or overwrites) every skill dir under `~/.claude/skills/`. Override destination with `CLAUDE_SKILLS_DIR=/some/path ./scripts/install-skills.sh`.

### Required system binaries

| purpose | binary | apt package |
|---------|--------|-------------|
| PDF → text | `pdftotext` | `poppler-utils` |
| DOCX/EPUB/ODT/RTF → text | `pandoc` | `pandoc` |
| XLSX → CSV | `xlsx2csv` | `xlsx2csv` |

Install all on Debian/Ubuntu:

```
sudo apt install -y poppler-utils pandoc xlsx2csv
```

### Skills shipped

| skill | handles |
|-------|---------|
| `extract-document` | dispatcher — reads the extension and points at the right extractor |
| `pdf-to-text` | `.pdf` |
| `docx-to-text` | `.docx`, `.odt` |
| `epub-to-text` | `.epub` |
| `xlsx-to-text` | `.xlsx`, `.xls` (with notes on legacy .xls) |

Each SKILL.md is a short operator doc: commands, head-cap tactics, and common failure modes. See `skills/<name>/SKILL.md`.

## Security notes

- Transcribe and upload endpoints are both behind the existing `authenticateToken` JWT middleware.
- Uploaded files retain their original extension in the saved filename; the server does not execute or parse them — that's the agent's job, via the skills above.
- Extracted text from any document is untrusted user content. Skills remind the model of that.
