const input = require('fs').readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const supply = new Map([
  [ 'red', 12 ],
  [ 'green', 13 ],
  [ 'blue', 14 ]
]);

let total = 0;
for (const line of lines) {
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const [ , game, rest ] = line.match(/^Game (\d+): (.*)$/);
  const gameId = parseInt(game);
  const sets = parseSets(rest);
  if (!sets.find(set => !possible(set))) {
    total += gameId;
  }
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

function possible(set) {
  return ![ 'red', 'green', 'blue' ].find(color => set.get(color) > supply.get(color));
}
