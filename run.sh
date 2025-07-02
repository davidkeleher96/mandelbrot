#!/usr/bin/env bash
#
# -------------------------------------------------------------------

set -euo pipefail

NODE_ARGS=""
RENDER_OUT=""
RENDER_CMAP="nipy_spectral"
RENDER_SHOW=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --node-args)
      NODE_ARGS="$2"; shift 2 ;;
    --out|-o)
      RENDER_OUT="$2"; shift 2 ;;
    --cmap)
      RENDER_CMAP="$2"; shift 2 ;;
    --show)
      RENDER_SHOW=true; shift ;;
    *)
      echo "Unknown flag: $1" >&2; exit 1 ;;
  esac
done

source ./python/venv/scripts/activate
# ───── run the pipeline ─────
mbcli mandelbrot ${NODE_ARGS} \
| python ./python/render.py - \
    ${RENDER_OUT:+--output "$RENDER_OUT"} \
    --cmap "$RENDER_CMAP" \
    $([[ "$RENDER_SHOW" == true ]] && echo --show)
