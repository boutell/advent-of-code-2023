import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

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

let beams = [
  {
    x: -1,
    y: 0,
    dir: 1
  }
];

const inputs = [];
for (let y = 0; (y < lines.height); y++) {
  inputs.push([
    {
      x: 0,
      y,
      dir: 1,
      seen: new Set()
    }
  ]);
  inputs.push([
    {
      x: lines[0].length - 1,
      y,
      dir: 3,
      seen: new Set()
    }
  ]);
}

for (let x = 0; (x < lines[0].length); x++) {
  inputs.push([
    {
      x,
      y: 0,
      dir: 2,
      seen: new Set()
    }
  ]);
  inputs.push([
    {
      x,
      y: lines.length - 1,
      dir: 0,
      seen: new Set()
    }
  ]);
}

console.log(inputs.reduce((a, beams) => {
  console.log(`checking ${JSON.stringify(beams[0])}`);
  const c = countEnergized(lines, beams);
  if (c > a) {
    return c;
  } else {
    return a;
  }
}, 0));

function countEnergized(lines, beams) { 
  const starts = new Set(); 
  const grid = new Grid(structuredClone(lines));
  for (const cell of grid.cells()) {
    cell.value = {
      v: cell.value,
      e: false
    };
  }  
  for (const beam of beams) {
    grid.getValue(beam.x, beam.y).e = true;
  }
  const seen = new Set();
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
      const key = getKey(beam);
      if (!seen.has(key)) {
        change = true;
      }
      seen.add(key);
      if (beam.seen.has(key)) {
        beams = beams.filter(b => b !== beam);
        continue;
      }
      beam.seen.add(key);
      if (v === '.') {
        continue;
      } else if (v === '/') {
        beam.dir = forwardBounces[beam.dir];
      } else if (v === '\\') {
        beam.dir = backBounces[beam.dir];
      } else if (v === '-') {
        if (xSplits[beam.dir]) {
          beam.dir = 1;
          const key = getKey({
            ...beam,
            dir: 3
          });
          if (!starts.has(key)) {
            beams.push({
              ...beam,
              dir: 3,
              seen: new Set()
            });
            starts.add(key);
          }
        }
      } else if (v === '|') {
        if (ySplits[beam.dir]) {
          beam.dir = 0;
          const key = getKey({
            ...beam,
            dir: 3
          });
          if (!starts.has(key)) {
            beams.push({
              ...beam,
              dir: 2,
              seen: new Set()
            });
            starts.add(key);
          }
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

  return count;
}

function getKey(beam) {
  return JSON.stringify({
    x: beam.x,
    y: beam.y,
    dir: beam.dir
  });
}
