import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';
import memoize from './lib/memoize.mjs';
import key from './lib/key.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));
const dirs = [
  {
    xd: 0,
    yd: -1
  },
  {
    xd: 1,
    yd: 0
  },
  {
    xd: 0,
    yd: 1
  },
  {
    xd: -1,
    yd: 0
  }
];
const grid = new Grid(lines);

for (const cell of grid.cells()) {
  cell.value = +cell.value;
}

const cache = new Map();

const cost = optimizeFrom(0, 0, 0, 0, new Set());
console.log(cost);

function optimizeFrom(x, y, dir, steps, path) {
  const k = key(x, y, dir, steps);
  if (cache.has(k)) {
    return cache.get(k);
  }
  const result = optimizeFromBody(x, y, dir, steps, path);
  cache.set(k, result);
  return result;
}

function optimizeFromBody(x, y, dir, steps, path) {
  if (path.size >= 1000) {
    return Number.MAX_VALUE;
  }
  path.add(key(x, y, dir, steps));
  // print(path);
  const moves = [];
  if (steps !== 3) {
    moves.push(dir);
  }
  const left = (dir + 4 - 1) % 4;
  const right = (dir + 1) % 4;
  moves.push(left);
  moves.push(right);
  let min = Number.MAX_VALUE;
  for (const move of moves) {
    let moveValue;
    const cell = grid.get(x, y).step(dirs[move].xd, dirs[move].yd);
    if (!cell) {
      // Out of bounds
      continue;
    }
    const s = (move == dir) ? (steps + 1) : 0;
    const k = key(cell.x, cell.y, move, s);
    if (path.has(k)) {
      moveValue = Number.MAX_VALUE;
    } else if ((cell.x === grid.width - 1) && (cell.y === grid.height - 1)) {
      moveValue = cell.value;
    } else {
      moveValue = optimizeFrom(cell.x, cell.y, move, s, new Set(path));
      moveValue += cell.value;
    }
    if (moveValue < min) {
      min = moveValue;
    }
  }
  return min;
}

function print(path) {
  console.log('\n');
  const grid = new Grid(lines);
  for (const p of path) {
    const [ x, y ] = JSON.parse(p);
    grid.setValue(x, y, '*');
  }
  grid.print();
}