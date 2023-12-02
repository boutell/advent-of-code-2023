const input = require('fs').readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

let total = 0;
for (const line of lines) {
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const [ , game, rest ] = line.match(/^Game (\d+): (.*)$/);
  const gameId = parseInt(game);
  const sets = parseSets(rest);
  total += power([ 'red', 'green', 'blue' ].map(color => max(color, sets)));
}
console.log(total);

function parseSets(sets) {
  return sets.split(/;\s*/).map(parseSet);
}

function parseSet(set) {
  return new Map(set.split(/,\s*/).map(parsePair));
}

function parsePair(pair) {
  const [ n, color ] = pair.split(' ');
  // key, value order, for use in constructing a Map object
  return [ color, parseInt(n) ];
}

function max(color, sets) {
  return Math.max(...sets.map(set => set.get(color) || 0)); 
}

function power(maxes) {
  return maxes.reduce((total, n) => total * n, 1);
}
