import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

let seeds;
let maps = [];
let map;

for (const line of lines) {
  if (line.match(/seeds:/)) {
    const [ , seedString ] = line.split(/:\s+/);
    seeds = seedString.split(' ');
  } else if (line.match(/map:/)) {
    const matches = line.match(/(\w+)-to-*(\w+) map:/);
    const src = matches[1];
    const dst = matches[2];
    if (map) {
      maps.push(map);
    }
    map = {
      src,
      dst,
      rules: []
    }
  } else if (line.match(/\d+/)) {
    const [ dst, src, range ] = line.split(' ');
    map.rules.push({
      src: +src,
      dst: +dst,
      range: +range
    });
  }
}
if (map) {
  maps.push(map);
}

console.log(Math.min(...seeds.map(resolve)));

function resolve(value) {
  for (const map of maps) {
    value = resolveMap(map, value);
  }
  return value;
}

function resolveMap(map, value) {
  const rule = map.rules.find(({ src, dst, range }) => {
    return (value >= src) && (value < src + range);
  });
  if (rule) {
    return rule.dst + (value - rule.src);
  }
  return value;
}
