import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';
import chalk from 'chalk';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const directions = {
  '|': [ [ 0, -1 ], [ 0, 1 ] ],
  '-': [ [ -1, 0 ], [ 1, 0 ] ],
  'L': [ [ 0, -1 ], [ 1, 0 ] ],
  'J': [ [ 0, -1 ], [ -1, 0 ] ],
  '7': [ [ 0, 1 ], [ -1, 0 ] ],
  'F': [ [ 0, 1 ], [ 1, 0 ] ],
  '.': [ ],
  S: 'start'
};
const art = {
  '|': '|',
  '-': '-',
  'L': '╰',
  'J': '╯',
  '7': '╮',
  'F': '╭',
  '.': '.',
  S: 'S'
};
const grid = new Grid(lines.map(line => line.split('').map(ch => ({
  links: directions[ch],
  art: art[ch],
  distance: false
}))));
const nodes = [];
let start = false;
for (const cell of grid.cells()) {
  if (cell.value.links === 'start') {
    start = cell;
    cell.value.distance = 0;
    cell.value.links = [];
    for (const neighbor of cell.neighbors()) {
      let foundStart = false;
      for (const next of links(neighbor, false)) {
        if ((cell.x === next.x) && (cell.y === next.y)) {
          foundStart = true;
          break;
        }
      }
      if (foundStart) {
        cell.value.links.push([ neighbor.x - cell.x, neighbor.y - cell.y ]);
      }
    }
    break;
  }
}

while (paint());
print(grid);

const data2 = [];
for (let y = 0; (y < grid.height * 2); y++) {
  data2.push([]);
  for (let x = 0; (x < grid.width * 2); x++) {
    const cell = grid.get(Math.floor(x / 2), Math.floor(y / 2));
    if ((!(x % 2)) && (!(y % 2))) {
      if (cell.value.distance !== false) {
        data2[y][x] = '+';
      } else {
        data2[y][x] = '.';
      }
    } else if (cell.value.distance !== false) {
      const dx = x % 2;
      const dy = y % 2;
      if (dy && (!dx) && cell.value.links.find(link => link[1] === 1)) {
        data2[y][x] = '|';
      } else if (dx && (!dy) && cell.value.links.find(link => link[0] === 1)) {
        data2[y][x] = '-';
      } else {
        data2[y][x] = ' ';
      }
    } else {
      data2[y][x] = ' ';
    }
  }
}

const grid2 = new Grid(data2);
const start2 = findStart2();
console.log(start2);
grid2.setValue(start2[0], start2[1], '#');
while (paint2());
print2();

let count = 0;
for (const cell of grid2.cells()) {
  if (cell.value === '@') {
    count++;
  }
}
console.log(count);

function paint() {
  let change = false;
  for (const cell of grid.cells()) {
    for (const neighbor of links(cell, true)) {
      if (
        (neighbor.value.distance !== false) &&
        (
          (cell.value.distance === false) ||
          (neighbor.value.distance + 1 < cell.value.distance)
        )
      ) {
        change = true;
        cell.value.distance = neighbor.value.distance + 1;
      }
    }
  }
  return change;
}

function findStart2() {
  for (let y = 0; (y < grid.height); y++) {
    for (let x = 0; (x < grid.width); x++) {
      const cell = grid.get(x, y);
      if (cell.value.distance !== false) {
        if (cell.value.art === '|') {
          return [ x * 2 + 1, y * 2 ];
        } else {
          break;
        }
      }
    }
  }
  throw new Error('Could not find start point');
}

function paint2() {
  let change = false;
  for (const cell of grid2.cells()) {
    if ((cell.value === '#') || (cell.value === '@')) {
      for (const neighbor of cell.neighbors()) {
        if (neighbor.value === '.') {
          change = true;
          neighbor.value = '@';
        } else if (neighbor.value === ' ') {
          change = true;
          neighbor.value = '#';
        }
      }
    }
  }
  return change;
}

function* links(cell, strict) {
  for (const [ dx, dy ] of cell.value.links) {
    const neighbor = cell.step(dx, dy);
    if (neighbor) {
      if (!strict) {
        yield neighbor;
      }
      // Deal with junk pipe: a link is only valid if it points both ways
      if (neighbor.value.links.find(([ rdx, rdy ]) => (dx === -rdx) && (dy === -rdy))) {
        yield neighbor;
      }
    }
  }
}

function print(grid) {
  for (let y = 0; (y < grid.height); y++) {
    let s = '';
    for (let x = 0; (x < grid.width); x++) {
      const { value } = grid.get(x, y);
      const art = value.art;
      if (value.distance === 0) {
        s += chalk.red(art);
      } else if (value.distance !== false) {
        s += chalk.blue(art);
      } else {
        s += art;
      }
    }
    console.log(s);
  }
}

function print2(grid) {
  for (let y = 0; (y < grid2.height); y++) {
    let s = '';
    for (let x = 0; (x < grid2.width); x++) {
      const { value } = grid2.get(x, y);
      if (value === '@') {
        s += chalk.green('@');
      } else if (value === '.') {
        s += chalk.red('X');
      } else {
        s += value;
      }
    }
    console.log(s);
  }
}
