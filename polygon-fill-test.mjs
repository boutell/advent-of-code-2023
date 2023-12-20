import fill from './lib/polygon-fill.mjs';

const edges = [
  {
    x1: 10,
    y1: 0,
    x2: 20,
    y2: 10
  },
  {
    x1: 20,
    y1: 10,
    x2: 0,
    y2: 10
  },
  {
    x2: 0,
    y1: 10,
    x1: 10,
    y2: 0
  }
];

console.log(fill(edges));