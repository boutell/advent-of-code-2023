import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

const grid = new Grid(lines);

for (const cell of grid.cells()) {
  cell.value = {
    v: cell.value,
    d: (cell.value === 'S') ? 0 : false
  };
}

let change;
do {
  change = false;
  for (const cell of grid.cells()) {
    if (cell.value.d !== false) {
      for (const n of cell.taxi()) {
        const value = n.value;
        if ((value.v === '.') && ((value.d === false) || (value.d > cell.value.d + 1))) {
          value.d = cell.value.d + 1;
          change = true;
        }
      }
    }
  }
} while (change);

let count = 0;
for (const cell of grid.cells()) {
  const value = cell.value;
  if (((value.v === '.') || (value.v === 'S')) && (value.d !== false) && (value.d <= 64) && (!(value.d & 1))) {
    count++;
    value.r = true;
  }
}

grid.print(v => {
  if (v.d === false) {
    return 'f   ';
  } else {
    return String(v.d).padStart(3, '0') + (v.r ? '*' : ' ');
  }
});

console.log(count);
