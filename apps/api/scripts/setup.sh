#!/usr/bin/env bash
set -euo pipefail

PB_VERSION="0.19.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$(dirname "$SCRIPT_DIR")"
BIN_PATH="$API_DIR/pocketbase"

if [[ -x "$BIN_PATH" ]]; then
  INSTALLED=$("$BIN_PATH" --version 2>/dev/null | awk '{print $3}' || echo "")
  if [[ "$INSTALLED" == "$PB_VERSION" ]]; then
    echo "pocketbase $PB_VERSION already installed at $BIN_PATH"
    exit 0
  fi
fi

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$OS" in
  darwin) PB_OS="darwin" ;;
  linux)  PB_OS="linux" ;;
  *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64) PB_ARCH="amd64" ;;
  arm64|aarch64) PB_ARCH="arm64" ;;
  *) echo "Unsupported arch: $ARCH" >&2; exit 1 ;;
esac

URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${PB_OS}_${PB_ARCH}.zip"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Downloading pocketbase $PB_VERSION for ${PB_OS}_${PB_ARCH}..."
curl -fsSL "$URL" -o "$TMP_DIR/pb.zip"
unzip -q "$TMP_DIR/pb.zip" -d "$TMP_DIR"
mv "$TMP_DIR/pocketbase" "$BIN_PATH"
chmod +x "$BIN_PATH"

echo "Installed pocketbase $PB_VERSION at $BIN_PATH"
