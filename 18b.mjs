import { readFileSync } from 'fs';
import fill from './lib/polygon-fill.mjs';
import SparseGrid from './lib/sparse-grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

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
const edges = [];
for (const move of moves) {
  const e = {
    x1: x,
    y1: y
  };
  const dir = dirs[move.dir];
  for (let j = 0; (j < move.dist); j++) {
    x += dir[0];
    y += dir[1];
  }
  e.x2 = x;
  e.y2 = y;
  edges.push(e);
}

const strokes = fill(edges);
const grid = new SparseGrid();
for (const stroke of strokes) {
  for (let x = stroke.x1; (x <= stroke.x2); x++) {
    grid.setValue(x, stroke.y, '#');    
  }
}
grid.print();
console.log(strokes.reduce((a, s) => a + (s.x2 - s.x1) + 1, 0));

// 17a parser, for a tractable test case
function parseMove(line) {
  const [ , dir, dist, color ] = line.match(/^([UDLR]) (\d+) \((\S+)\)$/);
  return {
    dir,
    dist: +dist,
    color
  };
}

// function parseMove(line) {
//   let [ , dir, dist, color ] = line.match(/^([UDLR]) (\d+) \((\S+)\)$/);
//   color = color.substring(1);
//   color = parseInt(color, 16);
//   dist = color >> 4;
//   dir = [ 'R', 'D', 'L', 'U' ][color & 3];
//   return {
//     dir,
//     dist
//   };
// }