#!/usr/bin/env bash
set -euo pipefail

# Config
MODEL="${MODEL:-gpt-4o-mini}"     # change if you prefer another model
STYLE="${STYLE:-conventional}"    # conventional|plain
LANG="${LANG:-en}"                # en|de|...

if ! git diff --staged --quiet; then
  DIFF="$(git diff --staged --unified=0)"
else
  echo "No staged changes. Stage files first: git add -A"
  exit 1
fi

read -r -d '' SYSTEM <<'EOF'
You write excellent, precise commit messages.
- If style is "conventional", use Conventional Commits (type(scope): subject)
- Use imperative, concise subject (~50-72 chars)
- No trailing period, no extra text besides the message
EOF

read -r -d '' USER <<EOF
Style: ${STYLE}
Language: ${LANG}
Create a single-line commit message describing the staged diff.
Diff:
${DIFF}
EOF

MSG="$(
  curl -s https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer ${OPENAI_API_KEY}" \
    -H "Content-Type: application/json" \
    -d @- <<JSON | jq -r '.choices[0].message.content' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//'
{
  "model": "${MODEL}",
  "temperature": 0.2,
  "messages": [
    {"role":"system","content": ${SYSTEM@Q}},
    {"role":"user","content": ${USER@Q}}
  ]
}
JSON
)"

if [[ -z "$MSG" ]]; then
  echo "No message returned."
  exit 1
fi

# Write to a temp file and allow editing before commit
msgfile="$(mktemp -t ai-commit-msg.XXXXXX)"
trap 'rm -f "$msgfile"' EXIT
printf "%s\n" "$MSG" > "$msgfile"

# Pick an editor (EDITOR > VISUAL > nano > vi)
if [[ -n "${EDITOR:-}" ]]; then
  EDITOR_CMD="$EDITOR"
elif [[ -n "${VISUAL:-}" ]]; then
  EDITOR_CMD="$VISUAL"
elif command -v nano >/dev/null 2>&1; then
  EDITOR_CMD="nano"
elif command -v vi >/dev/null 2>&1; then
  EDITOR_CMD="vi"
else
  EDITOR_CMD=""
fi

while true; do
  if [[ -n "$EDITOR_CMD" ]]; then
    "$EDITOR_CMD" "$msgfile"
  fi

  echo "----- Commit message preview -----"
  cat "$msgfile"
  echo "----------------------------------"

  # Ensure non-empty message
  if [[ ! -s "$msgfile" ]]; then
    read -r -p "Message is empty. Edit again? [Y/n]: " ans
    ans=${ans:-Y}
    if [[ "$ans" =~ ^[Yy]$ ]]; then
      continue
    else
      echo "Aborted: empty message."
      exit 1
    fi
  fi

  read -r -p "Proceed with commit? [c]ommit / [e]dit / [a]bort: " action
  case "${action:-c}" in
    c|C)
      git commit -F "$msgfile"
      break
      ;;
    e|E)
      continue
      ;;
    a|A)
      echo "Aborted by user."
      exit 1
      ;;
    *)
      echo "Unknown choice. Please select c/e/a."
      ;;
  esac
done