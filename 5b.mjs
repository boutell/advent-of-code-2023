import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const seedRanges = [];
let maps = [];
let map;

for (const line of lines) {
  if (line.match(/seeds:/)) {
    const [ , seedString ] = line.split(/:\s+/);
    const numbers = seedString.split(' ');
    for (let i = 0; (i < numbers.length); i+= 2) {
      seedRanges.push([ +numbers[i], +numbers[i + 1] ]);
    }
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

let min = false;
for (const seedRange of seedRanges) {
  let n = 0;
  for (let i = seedRange[0]; (i < seedRange[0] + seedRange[1]); i++) {
    const result = resolve(i);
    if ((min === false) || (result < min)) {
      min = result;
    }
    n++;
    if (!(n % 1000000)) {
      console.log(`${n} of ${seedRange[1]} (${n / seedRange[1]})`);
    }
  }
}
console.log(min);

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
