import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

// LLR

// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)

const steps = lines[0].split('');
const nodes = lines.slice(1).map(line => {
  const matches = line.match(/^(\w\w\w) = \((\w\w\w), (\w\w\w)\)/);
  return {
    name: matches[1],
    L: matches[2],
    R: matches[3],
    start: matches[1].endsWith('A'),
    end: matches[1].endsWith('Z'),
  };
});

const map = new Map();
for (const node of nodes) {
  map.set(node.name, node);
}

const ghosts = nodes.filter(node => node.start).map(node => ({
  node,
  finished: false,
  starts: []
}));

let n = 0;
let finished = 0;
outer: while (true) {
  for (const ghost of ghosts) {
    if (ghost.finished) {
      continue;
    }
    console.log(ghost.node.name);
    if (ghost.node.end) {
      console.log('!!!');
      ghost.ends.push(n);
    }
    const next = ghost.node[steps[n % steps.length]];
    ghost.node = map.get(next);
    if (ghost.visited.has(next)) {
      ghost.finished = true;
      finished++;
      if (finished === ghosts.length) {
        break outer;
      }
    }
    ghost.visited.add(next);
  }
  n++;
  if (!(n % 1000000)) {
    console.log(n);
  }
}
console.log(n);

// console.log(ghosts);
