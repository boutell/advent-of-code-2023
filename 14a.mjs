import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

const grid = new Grid(lines);

let change;
do {
  change = false;
  for (const cell of grid.cells()) {
    if (cell.value === 'O') {
      const above = cell.step(0, -1);
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

print(grid);

let sum = 0;
for (const cell of grid.cells()) {
  if (cell.value === 'O') {
    sum += grid.height - cell.y; 
  }
}
console.log(sum);

function print(grid) {
  console.log(grid.data.map(row => row.join('')).join('\n'));
}
