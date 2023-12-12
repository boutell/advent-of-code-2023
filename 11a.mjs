import { readFileSync } from 'fs';
import Grid from './lib/grid.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));
const galaxies = [];

for (let y = 0; (y < lines.length); y++) {
  for (let x = 0; (x < lines[0].length); x++) {
    if (lines[y][x] === '#') {
      galaxies.push({ x, y });
    }
  }
}

const byX = [...galaxies];
byX.sort((a, b) => {
  if (a.x < b.x) {
    return -1;
  } else if (a.x > b.x) {
    return 1;
  } else {
    return 0;
  }
});

const byY = [...galaxies];
byY.sort((a, b) => {
  if (a.y < b.y) {
    return -1;
  } else if (a.y > b.y) {
    return 1;
  } else {
    return 0;
  }
});

let lastX = 0;
for (let i = 0; (i < byX.length); i++) {
  const gap = byX[i].x - lastX;
  for (let j = i; (j < byX.length); j++) {
    if (gap > 0) {
      byX[j].x += (gap - 1);
    }
  }
  lastX = byX[i].x;
}
let lastY = 0;
for (let i = 0; (i < byY.length); i++) {
  const gap = byY[i].y - lastY;
  for (let j = i; (j < byY.length); j++) {
    if (gap > 0) {
      byY[j].y += (gap - 1);
    }
  }
  lastY = byY[i].y;
}
print(galaxies);
const total = galaxies.length;
let sum = 0;
for (let i = 0; (i < total); i++) {
  for (let j = i + 1; (j < total); j++) {
    sum += distance(galaxies[i], galaxies[j]);
  }
}
console.log(sum);

function print(galaxies) {
  const data = [];
  for (let y = 0; (y <= byY[galaxies.length - 1].y); y++) {
    const row = [];
    for (let x = 0; (x <= byX[galaxies.length - 1].x); x++) {
      row.push('.');
    }
    data.push(row);
  }
  const grid = new Grid(data);
  for (const galaxy of galaxies) {
    grid.setValue(galaxy.x, galaxy.y, '@');
  }
  grid.print();
}

function distance(a, b) {
  return Math.abs(b.y - a.y) + Math.abs(b.x - a.x);
}
