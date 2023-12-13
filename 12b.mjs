import { readFileSync } from 'fs';

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
  // Possible new approach...
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
  for (let i = 0; (i <= zeroes - (runs.length - 1)); i++) {
    const series = [];
    for (let j = 0; (j < i); j++) {
      series.push('.');
    }
    for (let j = 0; (j < runs[0]); j++) {
      series.push('#');
    }
    solutions += solve(series, runs.slice(1));
  }
  return solutions;
  function solve(series, runs) {
    if (series.length + sum(runs) + runs.length > puzzle.series.length) {
      return 0;
    }
    if (!runs.length) {
      if (series.length < puzzle.series.length) {
        for (let i = series.length; (i < puzzle.series.length); i++) {
          series[i] = '.';
        }
      }
      if (series.length !== puzzle.series.length) {
        return 0;
      }
      if (!matchingSoFar(puzzle.series, series)) {
        return 0;
      }
      return 1;
    }
    let solutions = 0;
    for (let i = 1; (i <= zeroes - (runs.length - 1)); i++) {
      const next = [...series];
      for (let j = 0; (j < i); j++) {
        next.push('.');
      }
      for (let j = 0; (j < runs[0]); j++) {
        next.push('#');
      }
      if (matchingSoFar(puzzle.series, next)) {
        solutions += solve(next, runs.slice(1));
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

function matchingSoFar(s1, s2) {
  for (let i = 0; (i < s2.length); i++) {
    if ((s1[i] !== '?') && (s1[i] !== s2[i])) {
      return false;
    }
  }
  return true;
}