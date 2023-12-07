import { readFileSync } from 'fs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

const values = [ 'A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J' ].reverse();
const jokerValue = 0;

const hands = lines.map(line => {
  let [ cards, bid ] = line.split(' ');
  cards = cards.split('').map(face => values.indexOf(face));
  bid = +bid;
  const jokers = Array(cards.length).fill(false);
  for (let i = 0; (i < cards.length); i++) {
    if (cards[i] === jokerValue) {
      jokers[i] = true;
    }
  }
  const hand = {
    cards,
    bid,
    jokers
  };
  printHand(hand);
  return bestVariation(hand);
});

hands.sort(compareHands);
hands.reverse();

let score = 0;
let rank = 1;

for (const hand of hands) {
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

function* jokerVariations(hand, depth = 0) {
  let jokersFound = false;
  for (let i = 0; (i < hand.cards.length); i++) {
    const card = hand.cards[i];
    if (card === jokerValue) {
      jokersFound = true;
      for (let j = 1; (j < values.length); j++) {
        const newHand = {
          bid: hand.bid,
          cards: [...hand.cards],
          jokers: [...hand.jokers]
        };
        newHand.cards[i] = j;
        if (!hand.cards.find(value => value !== 0)) {
          printHand(newHand);
        }
        const found = jokerVariations(newHand, depth + 1);
        for (const hand of found) {
          yield hand;
        }
      }
    }
  }
  if (!jokersFound) {
    yield hand;
  }
}

function printHand(hand) {
  let s = '';
  for (let i = 0; (i < hand.cards.length); i++) {
    s += values[hand.cards[i]];
    if (hand.jokers[i]) {
      s += '*';
    }
  }
  console.log(s);
}

function compareCards(a, b) {
  for (let i = 0; (i < a.cards.length); i++) {
    const ac = a.jokers[i] ? 0 : a.cards[i];
    const bc = b.jokers[i] ? 0 : b.cards[i];
    if (ac !== bc) {
      return bc - ac;
    }
  }
  return 0;
}

function bestVariation(hand) {
  const variations = jokerVariations(hand);
  let bestHand;
  for (const hand of variations) {
    if (!bestHand || getType(hand) > getType(bestHand)) {
      bestHand = hand;
    }
  }
  return bestHand;
}
