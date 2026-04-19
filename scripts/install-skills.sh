#!/usr/bin/env bash
# Install the bundled extraction skills into ~/.claude/skills/ so Claude Code
# picks them up for every project, not just this repo.
#
# Idempotent: existing target files are overwritten.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$REPO_ROOT/skills"
DST_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "error: $SRC_DIR not found" >&2
  exit 1
fi

mkdir -p "$DST_DIR"

for skill_dir in "$SRC_DIR"/*/; do
  name="$(basename "$skill_dir")"
  target="$DST_DIR/$name"
  mkdir -p "$target"
  cp "$skill_dir/SKILL.md" "$target/SKILL.md"
  echo "installed: $name -> $target/SKILL.md"
done

echo
echo "Done. Ensure the extraction binaries are on PATH:"
echo "  pdftotext   (poppler-utils)"
echo "  pandoc      (pandoc)"
echo "  xlsx2csv    (xlsx2csv)"
