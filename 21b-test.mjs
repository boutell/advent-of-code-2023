// Strategy:
//
// * Every odd-numbered distance in the home grid is reachable.
// * Every even-numbered distance in its four bordering grids
// is reachable (note width and height are 131, so we swap
//  when we cross the border).
// * Every odd-numbered distance in the unvisited neighbors
// of those grids is reachable, and so on...
// * Until we start running out of range,
// * At which point we apply the 20a algorithm to that grid
// et cetera,
// * until we are entirely out of range.
//
// We have so many steps that we can't even enumerate the grids,
// so do it mathematically until we are pretty close to the edge
// of our range. It doesn't have to be perfect as long as we
// start doing the 20a algorithm soon enough and yet not so soon
// we can't finish the math.

import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));
const width = lines[0].length;
const height = lines.length;

const bigLines = [];
for (let row = 0; (row < 7); row++) {
  for (const line of lines) {
    let bigLine = [];
    for (let col = 0; (col < 7); col++) {
      let subLine;
      if ((row !== 3) || (col !== 3)) {
        subLine = line.map(v => (v === 'S') ? '.' : v);
      } else {
        subLine = [...line];
      }
      bigLine = [...bigLine, ...subLine];
    }
    bigLines.push(bigLine);
  }
}

const grid = new Grid(structuredClone(bigLines));

populateGrid(grid);

grid.shortestPath(({ v }) => v === '.');

compare(-3, -3, -2, -2);
compare(3, 3, 2, 2);
compare(3, -3, 2, -2);
compare(-3, 3, -2, 2);
compare(0, -3, 0, -2);
compare(0, 3, 0, 2);
compare(3, 0, 2, 0);
compare(0, -3, 0, -2);
compare(-3, 0, -2, 0);

function compare(gx1, gy1, gx2, gy2) {
  gx1 += 3;
  gy1 += 3;
  gx2 += 3;
  gy2 += 3;
  let lastDifference = false;
  for (let y = 0; (y < height); y++) {
    for (let x = 0; (x < width); x++) {
      const cv = grid.getValue(x + gx1 * width, y + gy1 * height);
      const vv = grid.getValue(x + gx2 * width, y + gy2 * height);
      if (cv.v === '#') {
        if (vv.v !== '#') {
          throw new Error('Misaligned grids');
        }
        continue;
      }
      const difference = cv.d - vv.d;
      if (lastDifference !== false) {
        if (difference !== lastDifference) {
          console.log(`Difference changes: ${gx1 - 3} ${gy1 - 3} ${gx2 - 3} ${gy2 - 3}: ${x} ${y} (${lastDifference} to ${difference})`);
        }
      }
      lastDifference = difference;
    }
  }
}

grid.print(v => {
  if (v.d === false) {
    return 'f   ';
  } else {
    return String(v.d).padStart(3, '0') + (v.r ? '*' : ' ');
  }
});

function populateGrid(grid) {
  for (const cell of grid.cells()) {
    cell.value = {
      v: cell.value,
      d: (cell.value === 'S') ? 0 : false
    };
  }
}
