import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

const grid = new Grid(lines);

for (const cell of grid.cells()) {
  cell.value = {
    v: cell.value,
    e: false
  };
}

const seen = new Set();

let beams = [
  {
    x: -1,
    y: 0,
    dir: 1
  }
];

const dirs = [
  {
    xd: 0,
    yd: -1
  },
  {
    xd: 1,
    yd: 0
  },
  {
    xd: 0,
    yd: 1
  },
  {
    xd: -1,
    yd: 0
  }
];

const forwardBounces = [
  // /
  1,
  0,
  3,
  2
];

const backBounces = [
  // \
  3,
  2,
  1,
  0
];

const xSplits = [
  true,
  false,
  true,
  false
];

const ySplits = [
  false,
  true,
  false,
  true
];

let change;
do {
  change = false;
  for (const beam of beams) {
    beam.x += dirs[beam.dir].xd;
    beam.y += dirs[beam.dir].yd;
    if (!grid.inBounds(beam.x, beam.y)) {
      beams = beams.filter(b => b !== beam);
      continue;
    }
    const cell = grid.get(beam.x, beam.y);
    const v = cell.value.v;
    const e = cell.value.e;
    if (!e) {
      cell.value.e = true;
    }
    const key = JSON.stringify(beam);
    if (!seen.has(key)) {
      change = true;
    }
    seen.add(key);
    if (v === '.') {
      continue;
    } else if (v === '/') {
      beam.dir = forwardBounces[beam.dir];
    } else if (v === '\\') {
      beam.dir = backBounces[beam.dir];
    } else if (v === '-') {
      if (xSplits[beam.dir]) {
        beam.dir = 1;
        beams.push({
          ...beam,
          dir: 3
        });
      }
    } else if (v === '|') {
      if (ySplits[beam.dir]) {
        beam.dir = 0;
        beams.push({
          ...beam,
          dir: 2
        });
      }
    } else {
      throw new Error(`Unexpected value: ${v}`);
    }
  }
} while (change);

let count = 0;
for (const cell of grid.cells()) {
  if (cell.value.e) {
    count++;
  }
}

console.log(count);
