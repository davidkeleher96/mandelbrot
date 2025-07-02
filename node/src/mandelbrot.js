// -----------------------------------------------------------
// Stream a Mandelbrot set as CSV rows to stdout
// -----------------------------------------------------------

export async function mandelbrot({
  cx = 0,                 // center X
  cy = 0,                 // center Y
  viewW = 4,              // width of window in complex units
  viewH = 4,              // height of window in complex units
  step  = 0.01,           // pixel size in complex units
  maxIter = 100,
  bound   = 2,
  power   = 2,
  out     = process.stdout,
} = {}) {

//  pixel dimensions
const nx = Math.max(1, Math.round(viewW / step));
const ny = Math.max(1, Math.round(viewH / step));

// Exact pixel spacing is simply `step`
const dx = step;
const dy = step;

// Place the grid so that the center pixel is (cx, cy)
const xMin = cx - (nx - 1) * dx / 2;
const yMin = cy - (ny - 1) * dy / 2;

  const buf = [];
  const row = new Array(nx);

  for (let j = 0; j < ny; j++) {
    const cImag = yMin + j * dy;

    for (let i = 0; i < nx; i++) {
      const cReal = xMin + i * dx;
      let zr = 0, zi = 0, iter = 0;

      while (zr * zr + zi * zi < bound * bound && iter < maxIter) {
       
          const r   = Math.hypot(zr, zi) ** power;
          const ang = Math.atan2(zi, zr) * power;
          zr = r * Math.cos(ang) + cReal;
          zi = r * Math.sin(ang) + cImag;
        
        iter++;
      }
      row[i] = iter === maxIter ? 0 : iter; // 0 indicates the number is INSIDE the set
    }

    buf.push(row.join(','), '\n');
    if (buf.length > 8192) { out.write(buf.join('')); buf.length = 0; }
  }
  if (buf.length) out.write(buf.join(''));
}
