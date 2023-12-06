import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const [ , ...times ] = lines[0].split(/\s+/);
const [ , ...distances ] = lines[1].split(/\s+/);

const races = [];
for (let i = 0; (i < times.length); i++) {
  races[i] = {
    time: +times[i],
    distance: +distances[i]
  };
}

console.log(races.reduce((a, race) => a * countWins(race), 1));

function countWins(race) {
  let wins = 0;
  for (let h = 0; (h <= race.time); h++) {
    let p = 0;
    let v = 0;
    for (let th = 0; (th < h); th++) {
      v++;
    }
    for (let m = 0; (m < race.time - h); m++) {
      p += v;
    }
    if (p > race.distance) {
      wins++;
    }
  }
  return wins;
}
