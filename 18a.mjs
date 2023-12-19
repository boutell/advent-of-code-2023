import { readFileSync } from 'fs';
import SparseGrid from './lib/sparse-grid.mjs';
import flood from './lib/flood.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const grid = new SparseGrid();

// R 6 (#70c710)

const moves = lines.map(parseMove);
let x = 0;
let y = 0;
const dirs = {
  L: [ -1, 0],
  R: [ 1, 0 ],
  U: [ 0, -1 ],
  D: [ 0, 1]
};

grid.setValue(x, y, '.');
for (let i = 0; (i < moves.length); i++) {
  const move = moves[i];
  const dir = dirs[move.dir];
  for (let j = 0; (j < move.dist); j++) {
    x += dir[0];
    y += dir[1];
    grid.setValue(x, y, '.');
  }
}

flood(grid, x + 1, y + 1, v => !v, '#');

grid.print(v => {
  if (v === '#') {
    return '#';
  } else if (v) {
    return '.';
  } else {
    return ' ';
  }
});

let area = 0;
for (const cell of grid.cells()) {
  if (cell.value) {
    area++;
  }
}
console.log(area);

function parseMove(line) {
  const [ , dir, dist, color ] = line.match(/^([UDLR]) (\d+) \((\S+)\)$/);
  return {
    dir,
    dist: +dist,
    color
  };
}