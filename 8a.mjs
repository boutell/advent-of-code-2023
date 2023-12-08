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
    R: matches[3]
  };
});

const map = new Map();
for (const node of nodes) {
  map.set(node.name, node);
}
let n = 0;
let here = map.get('AAA');
while (here.name !== 'ZZZ') {
  here = map.get(here[steps[n % steps.length]]);
  n++;
}
console.log(n);
