import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

// New strategy:
// * Track step/node pairings
// * When we return to one we know that ghost is repeating itself
// * Then store the whole recurring path of each ghost so we can do an
//   easy modulus lookup in it
// * When all ghosts are repeating themselves, start looking
//   for shared zees of the first pair of ghosts, until we
//   reach the end of the least common multiple of their
//   recurrence intervals
// * When we have that answer we can record just the shared
//   zees of that pair and start incrementing directly to those
//   points and testing against a third ghost up to the LCM
// * When we have that answer we can just record the shared
//   zees of that pair... etc. until we find a shared zee
//   of all of the ghosts
// * Make sure you start the search for the next ghost with
//   the time point where the previous ghosts coincided,
//   and don't skip it, in case they happen to be on a zee too

// LLR

// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)

const steps = lines[0].split('');
const nodes = lines.slice(1).map(line => {
  const [ , name, L, R ] = line.match(/^(\w\w\w) = \((\w\w\w), (\w\w\w)\)/);
  return {
    name,
    L,
    R,
    start: name.endsWith('A'),
    end: name.endsWith('Z'),
  };
});

const map = new Map();
for (const node of nodes) {
  map.set(node.name, node);
}

const ghosts = nodes.filter(node => node.start).map((node, i) => ({
  i,
  node,
  looped: false,
  zees: new Set(),
  last: false,
  visited: new Set([ key(node.name, 0) ])
}));

let n = 0;
const modulus = steps.length;

while (true) {
  const offset = n % modulus;
  for (const ghost of ghosts) {
    if (ghost.node.end) {
      const k = key(ghost.node.name, offset);
      if (!ghost.zees.has(k)) {
        console.log(`${ghost.i} has a zee at ${k} (${n})`);
        ghost.zees.add(k);
        ghost.endsAt = n;
      }
    }
  }
  if (!ghosts.find(ghost => !ghost.endsAt)) {
    break;
  }
  const step = steps[offset];
  for (const ghost of ghosts) {
    ghost.node = map.get(ghost.node[step]);
    if (!ghost.looped) {
      const k = key(ghost.node.name, offset);
      if (ghost.visited.has(k)) {
        ghost.looped = true;
        console.log(`${ghost.i} has looped at ${k} after ${ghost.visited.size}`);
      } else {
        ghost.visited.add(k);
      }
    }
  }
  n++;
  if (!(n % 1000000)) {
    console.log(n);
  }
}
let ends = ghosts.map(({ endsAt }) => endsAt);
console.log(ends);
// Compute LCM of ends
while (ends.length > 1) {
  let i = 0;
  let sum = 0;
  while (true) {
    sum += ends[0];
    if (!(sum % ends[1])) {
      ends = [ sum, ...ends.slice(2) ];
      console.log('finished LCM');
      break;
    }
  }
}
console.log(ends[0]);

function key(a, b) {
  return `${a}:${b}`;
}