#!/usr/bin/env python3

import sys
import argparse
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from io import StringIO

# CLI args 
p = argparse.ArgumentParser(description="Render escape-time CSV to an image.")
p.add_argument(
    "csv",
    nargs="?",
    help="CSV file to read (default: read from stdin)",
)
p.add_argument(
    "-o", "--output",
    metavar="FILE",
    help="Save PNG to FILE instead of (or in addition to) showing it",
)
p.add_argument(
    "--cmap", default="nipy_spectral",
    help="Matplotlib colormap name (default: nipy_spectral)",
)
p.add_argument(
    "--show", action="store_true",
    help="Open an interactive window",
)
args = p.parse_args()

# read the CSV stream 
if args.csv and args.csv != "-":
    # From a file
    csv_text = Path(args.csv).read_text()
else:
    # From stdin -- read until EOF
    csv_text = sys.stdin.read()

if not csv_text.strip():
    sys.exit("render.py: no data received -- is the pipe connected?")


data = np.loadtxt(StringIO(csv_text), delimiter=",", dtype=np.int32)

# render 
fig, ax = plt.subplots(figsize=(6, 6), dpi=200)
img = ax.imshow(
    data,
    cmap=args.cmap,
    origin="lower",          # (0,0) at lower-left
    interpolation="nearest", 
)
ax.set_axis_off()
fig.tight_layout(pad=0)

# save image
if args.output:
    plt.savefig(args.output, bbox_inches="tight", pad_inches=0)
    print(f"wrote {args.output}")

if args.show or not args.output:
    plt.show()
