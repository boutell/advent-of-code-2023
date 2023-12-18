// A* solution

import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';
import Heap from './lib/heap.mjs';
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
const grid = new Grid(structuredClone(lines));
const visited = new Grid(structuredClone(lines));
const fx = grid.width - 1;
const fy = grid.height - 1;

for (const cell of grid.cells()) {
  const cost = +cell.value;
  const map = new Map();
  for (let d = 0; (d < 4); d++) {
    for (let s = 1; (s < 4); s++) {
      const k = key(d, s);
      map.set(k, Number.MAX_VALUE);
    }
  }
  cell.value = {
    cost,
    best: map
  };
}

let nextPathId = 0;

const start = {
  x: 0,
  y: 0,
  dir: 0,
  steps: 0,
  cost: 0,
  route: []
};

const paths = new Heap((a, b) => {
  if (a && !b) {
    return a;
  }
  if (b && !a) {
    return b;
  }
  if (!(a || b)) {
    return 0;
  }
  return a.cost - b.cost;
});

paths.insert(start);

console.log(solve());

function solve() {
  let n = 0;
  while (true) {
    const path = paths.remove();
    // console.log(`Best estimate: ${path.cost} ${estimate(path)}`);
    if (estimate(path) === 0) {
      const result = new Grid(structuredClone(lines));
      let cost = 0;
      for (const step of path.route) {
        result.setValue(step[0], step[1], 'x');
        const c = grid.getValue(step[0], step[1]).cost;
        console.log(c);
        cost += c;
      }
      console.log('total: ' + cost);
      result.print();
      return path.cost;
    }
    visited.setValue(path.x, path.y, '*');
    n++;
    if (!(n % 1000)) {
      console.log(paths.data.length);
      visited.print();
    }
    const moves = [];
    if (path.steps !== 3) {
      moves.push(path.dir);
    }
    const left = (path.dir + 4 - 1) % 4;
    const right = (path.dir + 1) % 4;
    moves.push(left);
    moves.push(right);
    for (const move of moves) {
      const cell = grid.get(path.x, path.y).step(dirs[move].xd, dirs[move].yd);
      if (!cell) {
        // Out of bounds
        continue;
      }
      const s = (move === path.dir) ? (path.steps + 1) : 1;
      const cost = path.cost + cell.value.cost;
      const k = key(move, s);
      if (cost < cell.value.best.get(k)) {
        cell.value.best.set(k, cost);
        const route = [...path.route, [ cell.x, cell.y ] ];
        paths.insert({
          x: cell.x,
          y: cell.y,
          dir: move,
          steps: s,
          cost,
          route
        });
      }
    }
  }
}

function estimate(path) {
  return Math.abs(fx - path.x) + Math.abs(fy - path.y);
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