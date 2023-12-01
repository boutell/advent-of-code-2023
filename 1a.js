const input = require('fs').readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

let total = 0;
for (const line of lines) {
  const matches = line.match(/^[^\d]*(\d).*(\d)[^\d]*$/) || line.match(/(\d)/);
  const value = parseInt(matches[1] + (matches[2] || matches[1]));
  console.log(value);
  total += value;
}
console.log(total);

