#!/usr/bin/env bash
# batch_render.sh  –  read images.csv, call run.sh for each row
#
#
set -euo pipefail

CSV=${1:-images.csv}
OUTDIR=${2:-renders}
mkdir -p "$OUTDIR"

# Skip comments & header, and read one row at a time
grep -v '^\s*#' "$CSV" | tail -n +2 | \
while IFS=',' read -r NAME CX CY SIZE PIXELS MAXITER CMAP
do
  # Derive pixel step so the picture is PIXELS × PIXELS
  STEP=$(awk "BEGIN {printf \"%.17f\", $SIZE/($PIXELS-1)}")

  NODE_ARGS="--center-x $CX --center-y $CY \
             --width $SIZE --height $SIZE \
             --step $STEP -n $MAXITER"

  echo "→ Rendering $NAME  ($PIXELS x $PIXELS, maxIter=$MAXITER)…"

  ./run.sh \
      --node-args "$NODE_ARGS" \
      --out "$OUTDIR/$NAME" \
      ${CMAP:+--cmap "$CMAP"}
done
