// I need a breadth first search so that I'm advancing
// one step on all paths at once, e.g. I'll find the true
// solution first and when I get there I'll know it's
// optimal right away.
//
// So I have to start building an array of paths and advancing
// on them, and if I hit an x + y + dir + step combo I've seen
// before I can immediately discard it because it can't be more
// optimal than the earlier one.

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

let nextPathId = 0;

let paths = [
  {
    x: 0,
    y: 0,
    dir: 0,
    steps: 0,
    seen: new Set(),
    cost: 0,
    id: nextPathId++
  }
];

const best = new Map();

console.log(solve());

function solve() {
  const fx = grid.width - 1;
  const fy = grid.height - 1;
  let min = false;
  for (let n = 0; (n < 1000); n++) {
    console.log(n);
    const newPaths = [];
    if (min !== false) {
      console.log(paths.length);
    }
    for (const p of paths) {
      const minCost = Math.abs(fx - p.x) + Math.abs(fy - p.y);
      if ((min !== false) && (p.cost + minCost >= min)) {
        p.dead = true;
        continue;
      }
      const k = key(p.x, p.y, p.dir, p.steps);
      const b = best.get(k);
      if (b && (b.id !== p.id) && (b.cost <= p.cost)) {
        p.dead = true;
        continue;
      }
      best.set(k, p.cost);
      const moves = [];
      if (p.steps !== 3) {
        moves.push(p.dir);
      }
      const left = (p.dir + 4 - 1) % 4;
      const right = (p.dir + 1) % 4;
      moves.push(left);
      moves.push(right);
      for (let i = 0; (i < moves.length); i++) {
        const move = moves[i];
        const cell = grid.get(p.x, p.y).step(dirs[move].xd, dirs[move].yd);
        if (!cell) {
          // Out of bounds
          continue;
        }
        if ((cell.x === (grid.width - 1)) && (cell.y === (grid.height - 1))) {
          const win = p.cost + cell.value;
          if ((min === false) || (win < min)) {
            min = win;
            console.log('* ' + min);
          }
        }
        const s = (move === p.dir) ? (p.steps + 1) : 0;
        const k = key(cell.x, cell.y, move, s);
        if (p.seen.has(k)) {
          continue;
        }
        const cost = p.cost + cell.value;
        const seen = (i > 0) ? new Set(p.seen) : p.seen;
        seen.add(k);
        let np = (i > 0) ? {} : p;
        np.x = cell.x;
        np.y = cell.y;
        np.dir = move;
        np.steps = s;
        np.cost = cost;
        np.seen = seen;
        if (i > 0) {
          const minCost = Math.abs(fx - np.x) + Math.abs(fy - np.y);
          if ((min === false) || (np.cost + minCost < min)) {
            np.id = nextPathId++;
            newPaths.push(np);
          }
        }
      }
    }
    console.log('before:', paths.length);
    paths = paths.filter(path => !path.dead);
    console.log('after:', paths.length);
    for (const p of newPaths) {
      paths.push(p);
    }
    console.log('after birth:', paths.length);
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