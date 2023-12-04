import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53

const cards = lines.map(parseCard);
console.log(cards.reduce((a, card) => a + scoreCard(card), 0));

function parseCard(line) {
  let [ , n, winners, held ] = line.match(/^Card\s+(\d+):\s+(.*?) \| (.*)$/);
  n = parseInt(n);
  winners = winners.split(/\s+/).map(s => parseInt(s));
  held = held.split(/\s+/).map(s => parseInt(s));
  return {
    n,
    winners,
    held
  };
}

function scoreCard(card) {
  return card.held.reduce((a, h) =>
    card.winners.includes(h) ? ((a > 0) ? (a * 2) : 1) : a, 0
  );
}
