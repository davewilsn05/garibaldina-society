#!/bin/zsh

set -eu

cd "${0:A:h}"

preview_port="${1:-8080}"
preview_url="http://127.0.0.1:${preview_port}/"

python3 -m http.server "$preview_port" --bind 127.0.0.1 &
server_pid=$!

trap 'kill "$server_pid" 2>/dev/null || true' EXIT INT TERM

sleep 0.5
open "$preview_url"
wait "$server_pid"
