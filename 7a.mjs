import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const values = [ 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ].reverse();

const hands = lines.map(line => {
  let [ cards, bid ] = line.split(' ');
  cards = cards.split('').map(face => values.indexOf(face));
  bid = +bid;
  return {
    cards,
    bid
  };
});

hands.sort(compareHands);
hands.reverse();

let score = 0;
let rank = 1;
for (const hand of hands) {
  console.log(rank);
  console.log(hand.bid);
  printHand(hand);
  score += hand.bid * rank;
  rank++;
}
console.log(score);

function compareHands(a, b) {
  const diffType = getType(b) - getType(a);
  if (diffType !== 0) {
    return diffType;
  }
  return compareCards(a, b);
}

function getType(hand) {
  const counts = new Map();
  for (const card of hand.cards) {
    counts.set(card, (counts.get(card) || 0) + 1);
  }
  const present = new Set();
  for (const [ v, c ] of counts.entries()) {
    present.add(c);
  }
  if (present.has(5)) {
    return 7;
  }
  if (present.has(4)) {
    return 6;
  }
  if (present.has(3)) {
    if (present.has(2)) {
      return 5;
    } else {
      return 4;
    }
  }
  if (present.has(2)) {
    // 2 pair
    let pairs = 0;
    for (const [ v, c ] of counts.entries()) {
      if (c === 2) {
        pairs++;
      }
    }
    if (pairs === 2) {
      return 3;
    } else {
      return 2;
    }
  }
  return 1;
}

function printHand(hand) {
  let s = '';
  for (const card of hand.cards) {
    s += values[card];
  }
  console.log(s);
}

function compareCards(a, b) {
  for (let i = 0; (i < a.cards.length); i++) {
    const ac = a.cards[i];
    const bc = b.cards[i];
    if (ac !== bc) {
      return bc - ac;
    }
  }
  return 0;
}