import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const opcodes = lines[0].split(',');
const boxes = [];
for (let i = 0; (i < 256); i++) {
  boxes[i] = [];
}

for (const opcode of opcodes) {
  if (opcode.includes('=')) {
    let [ label, length ] = opcode.split('=');
    length = +length;
    const i = hash(label);
    const o = boxes[i].findIndex(lens => lens.label === label);
    const lens = {
      label,
      length
    };
    if (o !== -1) {
      boxes[i][o] = lens;
    } else {
      boxes[i].push(lens);
    }
  } else if (opcode.includes('-')) {
    const [ label, ] = opcode.split('-');
    const i = hash(label);
    boxes[i] = boxes[i].filter(lens => lens.label !== label);
  }
}

let sum = 0;
for (let i = 0; (i < boxes.length); i++) {
  for (let j = 0; (j < (boxes[i] || []).length); j++) {
    const lens = boxes[i][j];
    sum += (i + 1) * (j + 1) * lens.length;
  }
}
console.log(sum);

function hash(label) {
  let hash = 0;
  for (let i = 0; (i < label.length); i++) {
    hash += label.charCodeAt(i);
    hash *= 17;
    hash &= 0xff;
  }
  return hash;
}
