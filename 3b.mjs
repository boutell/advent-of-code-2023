import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const grid = new Grid(lines.map(line => line.split('')));

let total = 0;
for (const cell of grid.cells()) {
  if (cell.value === '*') {
    const partNumbers = [];
    for (const n of cell.neighbors()) {
      if (isDigit(n.value)) {
        let value = 0;
        for (const d of completeNumber(n)) {
          value *= 10;
          value += parseInt(d.value);
          d.value = '.';
        }
        partNumbers.push(value);
      }
    }
    if (partNumbers.length === 2) {
      total += partNumbers[0] * partNumbers[1];
    }
  }
}
console.log(total);

function completeNumber(cell) {
  return generate();
  function* generate() {
    let current = cell;
    for (const n of cell.walkFrom(-1, 0)) {
      if (!isDigit(n.value)) {
        break;
      }
      current = n;
    }
    yield current;
    for (const n of current.walkFrom(1, 0)) {
      if (!isDigit(n.value)) {
        break;
      }
      yield n;
    }
  }
}

function isDigit(value) {
  return value.match(/\d/);
}

function isSymbol(value) {
  return !isDigit(value) && value !== '.';
}
