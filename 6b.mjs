import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const timeString = lines[0].replace(/[^\d]/g, '');
const distanceString = lines[1].replace(/[^\d]/g, '');

const race = {
  time: +timeString,
  distance: +distanceString
};

const minH = approximate(testMinH, 1, race.time);
const afterMaxH = approximate(testAfterMaxH, minH, race.time); 
console.log(afterMaxH - minH);

function testMinH(t) {
  return ((race.time - t) * t) > race.distance && t <= race.time;
}

function testAfterMaxH(t) {
  return !testMinH(t);
}

function approximate(test, initial, max) {
  let step = Math.floor(max / 2);
  let last = initial;
  let value = initial;
  while (true) {
    if (test(value)) {
      if (step === 1) {
        return value;
      } else {
        step = Math.floor(step / 2);
        value = last;
      }
    }
    if ((value >= max) && (step < 1)) {
      throw new Error('exceeded max');
    }
    last = value;
    value = Math.floor(value + step);
  }
}
