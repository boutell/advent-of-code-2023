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

const optimizeFrom = memoize(optimizeFromBody);
const [path, cost] = optimizeFrom(0, 0, 0, 0, new Set());
const dirArrows = [
  '^',
  '>',
  'v',
  '<'
];

console.log(cost, path.size);
for (const move of path) {
  const [ x, y, dir, steps ] = JSON.parse(move);
  grid.setValue(x, y, dirArrows[dir]);
}
grid.print();

function optimizeFromBody(x, y, dir, steps, path) {
  path.add(key(x, y, dir, steps));
  const moves = [];
  if (steps !== 3) {
    moves.push(dir);
  }
  const left = (dir + 4 - 1) % 4;
  const right = (dir + 1) % 4;
  moves.push(left);
  moves.push(right);
  let min = false;
  let minPath;
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
      continue;
    }
    let p;
    if ((cell.x === grid.width - 1) && (cell.y === grid.height - 1)) {
      p = new Set(path);
      p.add(k);
      moveValue = cell.value;
    } else {
      [ p, moveValue ] = optimizeFrom(cell.x, cell.y, move, s, new Set(path));
      moveValue += cell.value;
    }
    if ((min === false) || (moveValue < min)) {
      min = moveValue;
      minPath = p;
    }
  }

  if (min === false) {
    // All paths blocked
    return [ , Number.MAX_VALUE ];
  }
  return [ minPath, min ];
}
