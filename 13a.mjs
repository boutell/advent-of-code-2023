import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').map(line => line.split(''));

const patterns = splitOnBlank(lines).map(input => new Grid(input));

let sum = 0;
for (const pattern of patterns) {
  const solution = solve(pattern);
  console.log(solution);
  if (solution.axis === 'x') {
    sum += solution.value;
  } else {
    sum += solution.value * 100;
  }
}
console.log(sum);

function solve(pattern) {
  return solveY(pattern) || solveX(pattern);
}

function solveX(pattern) {
  outer: for (let x = 1; (x < pattern.width); x++) {
    for (let i = 1; (i <= Math.min(x, pattern.width - x)); i++) {
      console.log(pattern.width, x, i);
      for (let y = 0; (y < pattern.height); y++) {
        if (pattern.getValue(x - i, y) !== pattern.getValue(x + i - 1, y)) {
          continue outer;
        }
      }
    }
    return {
      axis: 'x',
      value: x
    };
  }
  return false;
}

function solveY(pattern) {
  console.log(pattern.height);
  outer: for (let y = 1; (y < pattern.height); y++) {
    for (let i = 0; (i <= Math.min(y, pattern.height - y)); i++) {
      for (let x = 0; (x < pattern.width); x++) {
        if (y === 3) {
          console.log(y, i, x);
        }
        if (pattern.getValue(x, y - i) !== pattern.getValue(x, y + i - 1)) {
          continue outer;
        }
      }
    }
    return {
      axis: 'y',
      value: y
    };
  }
  return false;
}

function splitOnBlank(lines) {
  const output = [];
  let next = [];
  for (const row of lines) {
    if (!row.length) {
      if (next.length) {
        output.push(next);
        next = [];
      }
    } else {
      next.push(row);
    }
  }
  if (next.length) {
    output.push(next);    
  }
  return output;
}
