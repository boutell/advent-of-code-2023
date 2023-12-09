import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const sequences = lines.map(line => line.split(' ').map(s => +s));

let sum = 0;

for (let sequence of sequences) {
  const levels = [ sequence ];
  while (true) {
    const differential = differentiate(sequence);
    levels.push(differential);
    if (!differential.find(n => n !== 0)) {
      break;
    }
    sequence = differential;
  }
  levels.reverse();
  let last = 0;
  for (const level of levels.slice(1)) {
    const next = level[0] - last;
    level.push(next);
    last = next;
  }
  console.log(last);
  sum += last;
}

console.log(sum);

function differentiate(sequence) {
  const d = [];
  for (let i = 0; (i < sequence.length - 1); i++) {
    d.push(sequence[i + 1] - sequence[i]);
  }
  return d;
}