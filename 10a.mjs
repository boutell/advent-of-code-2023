import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const directions = {
  '|': [ [ 0, -1 ], [ 0, 1 ] ],
  '-': [ [ -1, 0 ], [ 1, 0 ] ],
  'L': [ [ 0, -1 ], [ 1, 0 ] ],
  'J': [ [ 0, -1 ], [ -1, 0 ] ],
  '7': [ [ 0, 1 ], [ -1, 0 ] ],
  'F': [ [ 0, 1 ], [ 1, 0 ] ],
  '.': [ ],
  S: 'start'
};
const grid = new Grid(lines.map(line => line.split('').map(ch => ({
  links: directions[ch],
  distance: false
}))));
const nodes = [];
let start = false;
for (const cell of grid.cells()) {
  if (cell.value.links === 'start') {
    start = cell;
    cell.value.distance = 0;
    cell.value.links = [];
    for (const neighbor of cell.neighbors()) {
      let foundStart = false;
      for (const next of links(neighbor)) {
        if ((cell.x === next.x) && (cell.y === next.y)) {
          foundStart = true;
          break;
        }
      }
      if (foundStart) {
        cell.value.links.push([ neighbor.x - cell.x, neighbor.y - cell.y ]);
      }
    }
    break;
  }
}

while (paint());

let max = 0;
for (const cell of grid.cells()) {
  if ((cell.value.distance !== false) && (cell.value.distance > max)) {
    max = cell.value.distance;
  }
}
console.log(max);

function paint() {
  let change = false;
  for (const cell of grid.cells()) {
    for (const neighbor of links(cell)) {
      if (
        (neighbor.value.distance !== false) &&
        (
          (cell.value.distance === false) ||
          (neighbor.value.distance + 1 < cell.value.distance)
        )
      ) {
        change = true;
        cell.value.distance = neighbor.value.distance + 1;
      }
    }
  }
  return change;
}

function* links(cell) {
  for (const [ dx, dy ] of cell.value.links) {
    const neighbor = cell.step(dx, dy);
    if (neighbor) {
      yield neighbor;
    }
  }
}