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

const heres = nodes.filter(node => node.start);
const visited = heres.map(here => new Set([ here.name ]));
console.log(heres.length);
let n = 0;
const modulus = steps.length;
const count = heres.length;

while (heres.find(node => !node.end)) {
  const step = steps[n % modulus];
  for (let i = 0; (i < count); i++) {
    heres[i] = map.get(heres[i][step]);
  }
  n++;
  if (!(n % 1000000)) {
    console.log(n);
  }
}
console.log(n);

function print(heres) {
  console.log(heres[0].name);
  // for (const here of heres) {
  //   console.log(here.name);
  // }
}