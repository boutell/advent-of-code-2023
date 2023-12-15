import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const opcodes = lines[0].split(',');
let sum = 0;
for (const opcode of opcodes) {
  let hash = 0;
  for (let i = 0; (i < opcode.length); i++) {
    hash += opcode.charCodeAt(i);
    hash *= 17;
    hash &= 0xff;
  }
  sum += hash;
}
console.log(sum);
