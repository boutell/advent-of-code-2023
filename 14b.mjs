import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

const grid = new Grid(lines);

const grids = new Map();

const cycles = 1000000000;
let jumped = false;
cycleLoop: for (let i = 0; (i < cycles); i++) {
  if (!jumped) {
    const data = JSON.stringify(grid.data);
    const previous = grids.get(data);
    if (previous) {
      const interval = i - previous.i;
      i += interval * Math.floor(cycles / interval);
      while (i > cycles) {
        i -= interval;
      }
      console.log(`Jumped to ${i}`);
      jumped = true;
    } else {
      grids.set(data, {
        data,
        i,
        sum: getSum()
      });
    }
  }
  roll(0, -1);
  roll(-1, 0);
  roll(0, 1);
  roll(1, 0);
  if (!(i % 1000)) {
    console.log(i / 1000);
  }
}

console.log(getSum());

function roll(dx, dy) {
  let change;
  do {
    change = false;
    for (const cell of grid.cells()) {
      if (cell.value === 'O') {
        const above = cell.step(dx, dy);
        if (above === false) {
          continue;
        }
        if ((above.value === '#') || (above.value === 'O')) {
          continue;
        }
        cell.value = '.';
        above.value = 'O';
        change = true;
      }
    }
  } while (change);
}

function getSum() {
  let sum = 0;
  for (const cell of grid.cells()) {
    if (cell.value === 'O') {
      sum += grid.height - cell.y; 
    }
  }
  return sum;
}

function print(grid) {
  console.log(grid.data.map(row => row.join('')).join('\n'));
}
