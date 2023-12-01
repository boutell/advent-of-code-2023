const input = require('fs').readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const values = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine' ];

let total = 0;
for (const line of lines) {
  const firstIndex = values.reduce((a, v) => {
    const index = line.indexOf(v);
    if (index !== -1) {
      return Math.min(a, index);
    } else {
      return a;
    }
  }, line.length);
  const lastIndex = values.reduce((a, v) => {
    const index = line.lastIndexOf(v);
    if (index !== -1) {
      return Math.max(a, index);
    } else {
      return a;
    }
  }, -1);
  const digit1 = getValue(line, firstIndex); 
  const digit2 = getValue(line, lastIndex);
  const value = parseInt(`${digit1}${digit2}`);
  console.log(`${digit1} ${digit2} ${value}`);
  total += value;
}
console.log(total);

function getValue(line, index) {
  return (values.findIndex(v => line.substring(index, index + v.length) === v) % 9) + 1;
}
