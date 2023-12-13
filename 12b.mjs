import { readFileSync } from 'fs';

let solutionCount = 0;

const input = readFileSync('/dev/stdin', 'utf8');
const puzzles = input.split('\n').filter(line => line.length > 0).map(line => parsePuzzle(line));

console.log(puzzles.reduce((a, puzzle) => {
  const r = solvePuzzle(puzzle);
  console.log(r);
  return a + r;
}, 0));

function solvePuzzle(puzzle) {
  console.log('next:');
  console.log(puzzle.series.join(''));
  // You know exactly how many ones there are.
  // You know the order they appear in.
  // You know how many zeroes there are.
  // You know there is at least one zero between
  // each group of ones.
  // Iterate on that.
  const length = puzzle.series.length;
  const runs = puzzle.runs;
  const ones = sum(runs);
  const zeroes = length - ones;
  let solutions = 0;
  const series = [];
  for (let i = 0; (i <= zeroes - (runs.length - 1)); i++) {
    let io = 0;
    for (let j = 0; (j < i); j++) {
      series[io++] = '.';
    }
    for (let j = 0; (j < runs[0]); j++) {
      series[io++] = '#';
    }
    solutions += solve(io, 1);
  }
  return solutions;
  function solve(o, r) {
    let s = 0;
    for (let i = r; (i < runs.length); i++) {
      s += runs[i];
    }
    const rl = runs.length - r;
    if (o + s + rl > puzzle.series.length) {
      return 0;
    }
    if (!rl) {
      while (o < puzzle.series.length) {
        series[o++] = '.';
      }
      if (o !== puzzle.series.length) {
        return 0;
      }
      if (!matchingSoFar(puzzle.series, series, o)) {
        return 0;
      }
      if ((solutionCount % 1000000) === 0) {
        console.log('PUZZLE: ' + puzzle.series.join(''));
        console.log('SERIES: ' + series.join(''));
      }
      solutionCount++;
      return 1;
    }
    let solutions = 0;
    for (let i = 1; (i <= zeroes - count(series, '.', o) - (rl - 1)); i++) {
      let io = o;
      for (let j = 0; (j < i); j++) {
        series[io++] = '.';
      }
      for (let j = 0; (j < runs[r]); j++) {
        series[io++] = '#';
      }
      if (matchingSoFar(puzzle.series, series, io)) {
        solutions += solve(io, r + 1);
      }
    }
    return solutions;
  }
}

function parsePuzzle(s) {
  const [ series, runs ] = s.split(' ');
  const r = {
    series: series.split(''),
    runs: runs.split(',').map(s => parseInt(s))
  };
  r.series = [...r.series, '?', ...r.series, '?', ...r.series, '?', ...r.series, '?', ...r.series];
  r.runs = [...r.runs, ...r.runs, ...r.runs, ...r.runs, ...r.runs];
  return r;
}

function sum(a) {
  return a.reduce((a, v) => a + v, 0);
}

function matchingSoFar(s1, s2, n) {
  for (let i = 0; (i < n); i++) {
    if ((s1[i] !== '?') && (s1[i] !== s2[i])) {
      return false;
    }
  }
  return true;
}

function count(series, v, o) {
  let i = 0;
  let count = 0;
  while (i < o) {
    if (series[i] === v) {
      count++;
    }
    i++;
  }
  return count;
}
