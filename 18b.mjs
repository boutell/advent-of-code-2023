import { readFileSync } from 'fs';

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

console.log(edges);

function parseMove(line) {
  let [ , dir, dist, color ] = line.match(/^([UDLR]) (\d+) \((\S+)\)$/);
  color = color.substring(1);
  color = parseInt(color, 16);
  dist = color >> 4;
  dir = [ 'R', 'D', 'L', 'U' ][color & 3];
  return {
    dir,
    dist
  };
}