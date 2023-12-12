import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const puzzles = input.split('\n').filter(line => line.length > 0).map(line => parsePuzzle(line));

let sum = puzzles.reduce((a, puzzle) => a + solvePuzzle(puzzle), 0);

console.log(sum);

function solvePuzzle(puzzle) {
  const bits = puzzle.series.length;
  const max = 1 << bits;
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
  let copy = series.join('');
  for (const run of puzzle.runs) {
    const rs = '#'.repeat(run);
    const rp = '!'.repeat(run);
    if (copy === rs) {
      copy = rp;
    } else if (copy.startsWith(`${rs}.`)) {
      copy = rp + copy.substring(run + 1);
    } else if (copy.endsWith(`.${rs}`)) {
      copy = copy.substring(0, copy.length - run) + rp;
    } else if (copy.includes(`.${rs}.`)) {
      copy = copy.replace(`.${rs}.`, `.${rp}.`);
    } else {
      return false;
    }
  }
  return true;
}

function parsePuzzle(s) {
  const [ series, runs ] = s.split(' ');
  const r = {
    series: series.split(''),
    runs: runs.split(',').map(s => parseInt(s))
  };
  return r;
}
