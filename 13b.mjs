import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').map(line => line.split(''));

const patterns = splitOnBlank(lines).map(input => new Grid(input));

let sum = 0;
for (const pattern of patterns) {
  console.log('next:');
  print(pattern);
  const solutionA = solve(pattern)[0];
  const solution = alternate(pattern, solutionA);
  if (solution.axis === 'x') {
    sum += solution.value;
  } else {
    sum += solution.value * 100;
  }
}
console.log(sum);

function alternate(pattern, solution) {
  let n = 0;
  for (let y = 0; (y < pattern.height); y++) {
    for (let x = 0; (x < pattern.width); x++) {
      const old = pattern.getValue(x, y);
      pattern.setValue(x, y, (old === '.') ? '#' : '.');
      const newSolutions = solve(pattern);
      const newSolution = newSolutions.find(newSolution => JSON.stringify(solution) !== JSON.stringify(newSolution));
      if (newSolution) {
        return newSolution;
      }
      pattern.setValue(x, y, old);
      n++;
    }
  }
  console.log('n is: ' + n);
  throw new Error('No solution');
}

function solve(pattern) {
  return [...solveX(pattern), ...solveY(pattern)];
}

function solveX(pattern) {
  const solutions = [];
  outer: for (let x = 1; (x < pattern.width); x++) {
    for (let i = 1; (i <= Math.min(x, pattern.width - x)); i++) {
      for (let y = 0; (y < pattern.height); y++) {
        if (pattern.getValue(x - i, y) !== pattern.getValue(x + i - 1, y)) {
          continue outer;
        }
      }
    }
    solutions.push({
      axis: 'x',
      value: x
    });
  }
  return solutions;
}

function solveY(pattern) {
  const solutions = [];
  outer: for (let y = 1; (y < pattern.height); y++) {
    for (let i = 0; (i <= Math.min(y, pattern.height - y)); i++) {
      for (let x = 0; (x < pattern.width); x++) {
        if (pattern.getValue(x, y - i) !== pattern.getValue(x, y + i - 1)) {
          continue outer;
        }
      }
    }
    solutions.push({
      axis: 'y',
      value: y
    });
  }
  return solutions;
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

function print(pattern) {
  for (const row of pattern.data) {
    console.log(row.join(''));
  }
  console.log();
}