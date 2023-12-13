import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const puzzles = input.split('\n').filter(line => line.length > 0).map(line => parsePuzzle(line));

let p = 0;

let sum = puzzles.reduce((a, puzzle) => {
  const s = solvePuzzle(puzzle, puzzle.series);
  console.log(s);
  return a + s;
}, 0);
console.log(sum);

function solvePuzzle(puzzle, series) {
  // console.log(puzzle.series.join('') + ' ' + series.join(''));
  let solutions = 0;
  if (puzzle.series.find((v, i) => (v !== '?') && (series[i] !== v))) {
    return 0;
  }
  const qat = series.findIndex(v => v === '?');
  if (qat === -1) {
    if (valid(puzzle, series)) {
      return 1;
    } else {
      return 0;
    }
  }
  let transitions = 0;
  let last = false;
  for (const v of series) {
    if ((v === '#') && (last === '.')) {
      transitions++;
    }
    last = v;
  }
  if (transitions > puzzle.runs.length) {
    return 0;
  }
  if (transitions + ((series.length - qat) / 2) < puzzle.runs.length) {
    return 0;
  }
  const n1 = [...series];
  n1[qat] = '.';
  const n2 = [...series];
  n2[qat] = '#';
  return solvePuzzle(puzzle, n1) + solvePuzzle(puzzle, n2);
}

function valid(puzzle, series) {
  p++;
  if (!(p % 1000000)) {
    console.log(series.join(''));
  }
  let runs = 0;
  let last = false;
  for (let i = 0; (i < series.length); i++) {
    const ps = puzzle.series[i];
    const s = series[i];
    if ((ps !== '?') && (ps !== s)) {
      return false;
    }
    if ((s === '#') && ((last === '.') || !last)) {
      runs++;
    }
    last = s;
  }
  if (runs !== puzzle.runs.length) {
    return false;
  }
  const seriesRuns = series.join('').split('.').filter(s => s.length > 0);
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
