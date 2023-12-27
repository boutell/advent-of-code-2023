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
import memoize from './lib/memoize.mjs';

const countGrid = memoize(countGridBody);

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

const grid = new Grid(structuredClone(lines));

populateGrid(grid);

grid.shortestPath(({ v }) => v === '.');

let odd = 0, even = 0, maxd = 0;
for (const cell of grid.cells()) {
  const value = cell.value;
  if (((value.v === '.') || (value.v === 'S')) && (value.d !== false)) {
    if (value.d & 1) {
      odd++;
    } else {
      even++;
    }
    if (value.d > maxd) {
      maxd = value.d;
    }
    value.r = true;
  }
}

// Show it's square and that the distances to the edges
// are always simple taxicab, while no points in the interior
// are worse than the taxicab distance from corner to corner

console.log(grid.width, grid.height, odd, even, maxd);

for (let i = 0; (i < grid.height); i++) {
  console.log(grid.getValue(i, 0).d, grid.getValue(i, grid.height - 1).d, grid.getValue(0, i).d, grid.getValue(grid.width - 1, i).d);
}

const steps = 26501365;
const remainder = steps % grid.width;

// Shows he added a half grid at the edge to make it interesting
// console.log(steps / grid.width, steps % grid.width);

let reachable = 0;

// How to do the math on the diamond without enumerating
// every grid? I'm dumb so let's do it by lines which
// is still fast enough

const maxGrids = Math.floor(steps / grid.height);

console.log('Counting grids');

for (let y = -maxGrids; (y <= maxGrids); y++) {
  let x1 = -(maxGrids - Math.abs(y));
  let x2 = maxGrids - Math.abs(y);
  const grids = (x2 - x1) + 1;
  let odds = Math.ceil(grids / 2);
  let evens = odds - 1;
  if (Math.abs(y) % 2) {
    // An extra step taken at grid level
    const tmp = odds;
    odds = evens;
    evens = tmp;
  }
  // Even-numbered grids, including the origin grid,
  // can access all odd numbered distances within the grid
  reachable += evens * odd;
  reachable += odds * even;
}

const edgeGrids = Math.ceil(steps / grid.height);

console.log('Counting edge grids');

for (let y = -edgeGrids; (y <= edgeGrids); y++) {
  let x1 = -(edgeGrids - Math.abs(y));
  let x2 = edgeGrids - Math.abs(y);
  const isOdd = (Math.abs(x1) + Math.abs(y)) % 2;
  if (x1 === x2) {
    reachable += countGrid([ 2 ], isOdd);
  } else {
    reachable += countGrid([ 2, 3 ], isOdd);
  }
}

grid.print(v => {
  if (v.d === false) {
    return 'f   ';
  } else {
    return String(v.d).padStart(3, '0') + (v.r ? '*' : ' ');
  }
});

console.log(reachable);
console.log(`Remainder: ${remainder}`);

function countGridBody(edges, isOdd) {
  let lines2 = structuredClone(lines);
  if (edges.includes(2)) {
    const line = [];
    for (let x = 0; (x < grid.width); x++) {
      line.push('.');
    }
    lines2.push(line);
  }
  if (edges.includes(3)) {
    lines2 = lines2.map(line => [ '.', ...line ]);
  }
  const grid2 = new Grid(lines2);
  for (const cell of grid2.cells()) {
    if (cell.value === 'S') {
      cell.value = '.';
    }
  }
  grid2.print();
  populateGrid(grid2);
  if (edges.includes(2)) {
    console.log(edges, grid.width, grid.height, grid2.width, grid2.height);
    for (let x = 0; (x < grid.width); x++) {
      const v = grid2.getValue(grid2.width - grid.width + x, grid2.height - 1);
      v.d = grid.getValue(x, 0).d;
      v.fake = true;
    }
  }
  if (edges.includes(3)) {
    for (let y = 0; (y < grid.height); y++) {
      const v = grid2.getValue(0, grid2.height - grid.height + y);
      v.d = grid.getValue(grid.width - 1, y).d;
      v.fake = true;
    }
  }
  if (edges.includes(2) && edges.includes(3)) {
    const v = grid2.getValue(0, grid2.height - 1);
    v.d = grid.getValue(grid.width - 1, 0);
    v.fake = true;
  }
  grid2.shortestPath(({ v }) => v === '.');
  let count = 0;
  for (const cell of grid2.cells()) {
    if (cell.value.d <= remainder) {
      if ((isOdd && (cell.value.d % 1)) || !(cell.value.d % 1)) {
        count++;
      }
    }
  }
  return count;
}

function populateGrid(grid) {
  for (const cell of grid.cells()) {
    cell.value = {
      v: cell.value,
      d: (cell.value === 'S') ? 0 : false
    };
  }
}

// Too high: 608153747386143
