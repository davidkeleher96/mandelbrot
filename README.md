# Mandelbrot CLI + Python Renderer

A small pipeline that  
1. **generates** escape-time counts for the Mandelbrot set using a  Node.js CLI  
2. **renders** them into PNG images using a Python script  
3. optionally **batches** many render jobs from a CSV

![Default Mandlebrot](/renders/default.jpg )
---

## Installation

1. **Clone** this repo  
   ```bash
   git clone https://github.com/you/mandelbrot-pipeline.git  
   cd mandelbrot
   ```

2. **Node.js setup**  
   ```bash
   npm install          # installs commander  
   chmod +x bin/mbcli.js  
   npm link             # makes `mbcli` available globally
   ```

3. **Python setup**  
   ```bash
   python3 -m venv python/venv  
   source python/venv/bin/activate  
   pip install numpy matplotlib  
   deactivate
   ```

---

## Usage

### 1. Generate + render one image

```bash
./run.sh \
  --node-args "--center-x 0 --center-y 0 --width 4 --height 4 --step 0.005 -n 200" \
  --out   output.png \
  --cmap  viridis \
  --show
```

This does:

```text
mbcli mandelbrot … | python python/render.py - -o output.png --cmap viridis --show
```

---

### 2. Generate CSV only

```bash
mbcli mandelbrot \
  --center-x 0 --center-y 0 \
  --width 4   --height 4 \
  --step 0.01 \
  -n 100 > fractal.csv
```

Then render manually:

```bash
python python/render.py fractal.csv -o pic.png --cmap plasma
```

---

### 3. Batch rendering from CSV

Create a `images.csv` with header, e.g.:

```csv
# name,cx,cy,size,pixels,maxiter
mandel1, 0, 0, 4, 800, 200
mandel2, -0.75, 0.1, 1.5, 1200, 300
```

Run:

```bash
./batch_render.sh images.csv renders/
```

- Reads each row  
- Calculates pixel `--step = size / (pixels−1)`  
- Calls `run.sh` to produce `renders/<name>.png`

---

##  Files

- **`node/bin/mbcli.js`**  
  Node.js CLI (Commander) that streams CSV of iteration counts.

- **`node/src/mandelbrot.js`**  
  Core generator: computes escape‐time, writes CSV rows.

- **`python/render.py`**  
  Reads CSV from stdin or file, renders with Matplotlib.

- **`run.sh`**  
  Shell wrapper to wire Node to Python, manage flags.

- **`batch_render.sh`**  
  Loop over a CSV of view specs → run.sh → multiple PNGs.

##  Examples
![Default Mandlebrot](/renders/seahorse_tail.jpg )
![Default Mandlebrot](/renders/seahorse_valley.jpg )

