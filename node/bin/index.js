#!/usr/bin/env node
import { Command }   from 'commander';
import { mandelbrot } from '../src/mandelbrot.js';

const program = new Command();

program
  .name('mbcli')
  .description('Mandelbrot generator')
  .version('0.2.0');

program
  .command('mandelbrot')
  .description('Stream escape-counts as CSV')
  .requiredOption('-x, --center-x <center-x>', 'x-coordinate of the center of the view',  parseFloat, 0)
  .requiredOption('-y, --center-y <center-y>', 'y-coordinate of the center of the view',  parseFloat, 0)
  .requiredOption('-w, --width <width>',    'width of the view',  parseFloat, 4)
  .requiredOption('-h, --height <height',   'height of the view', parseFloat, 4)
  .option('-s, --step <step>',            'resolution of the view (size of a pixel)',      parseFloat, 0.01)
  .option('-n, --max-iterations <max-iterations>',  'maximum number of iterations to perform at each pixel (default: 100)',  (v) => parseInt(v, 10),   100)
  .option('-b, --bound <bound>',           'divergence cutoff. If the abs(z) >= bound, the iterations stop. (default: 2)',    parseFloat, 2)
  .option('-p, --power <power>',           'exponent used in the mandelbrot equation (default: 2)',      parseFloat, 2)
  .action(async (opts) => { 
    await mandelbrot({
      cx:     opts.centerX,
      cy:     opts.centerY,
      viewW:  opts.width,
      viewH:  opts.height,
      step:   opts.step,
      maxIter: opts.maxIterations,
      bound:   opts.bound,
      power:   opts.power,
    });
  });

program.parse();
