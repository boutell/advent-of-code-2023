import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const puzzles = input.split('\n').filter(line => line.length > 0).map(line => parsePuzzle(line));

let sum = puzzles.reduce((a, puzzle) => a + solvePuzzle(puzzle), 0);

function solvePuzzle(puzzle) {
  const bits = puzzle.series.length;
  const max = 1 << bits;
  console.log(bits, max);
  let solutions = 0;
  for (let i = 0; (i < max); i++) {
    const series = [];
    for (let b = 0; (b < bits); b++) {
      if (i & (1 << b)) {
        series.push('#');
      } else {
        series.push('.');
      }
    }
    if (valid(puzzle, series)) {
      solutions++;
    }  
  }
  console.log('solved');
  return solutions;
}

function valid(puzzle, series) {
  for (let i = 0; (i < series.length); i++) {
    const ps = puzzle.series[i];
    const s = series[i];
    if ((ps !== '?') && (ps !== s)) {
      return false;
    }
  }
  const seriesRuns = series.join('').split('.').filter(s => s.length > 0);
  if (seriesRuns.length !== puzzle.runs.length) {
    return false;
  }
  if (puzzle.runs.find((r, i) => r !== seriesRuns[i].length)) {
    return false;
  }
  return true;
}

function parsePuzzle(s) {
  let [ series, runs ] = s.split(' ');
  series = series + '?' + series + '?' + series + '?' + series + '?' + series;
  runs = `${runs},${runs},${runs},${runs},${runs}`;
  const r = {
    series: series.split(''),
    runs: runs.split(',').map(s => parseInt(s))
  };
  return r;
}
