import { readFileSync } from 'fs';
const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const list = lines.map(parseModule);
const button = {
  name: 'button',
  type: '',
  dest: [ 'broadcaster' ]
  // layer: 0
};
list.push(button);
for (const m of list) {
  for (const d of m.dest) {
    // he introduces rando modules sometimes
    if (!list.find(m => m.name === d)) {
      list.push({
        name: d,
        type: '',
        dest: []
      });
    }
  }
}
for (const m of list) {
  m.received = [];
}
for (const m of list) {
  m.dest = m.dest.map(name => list.find(m => m.name === name));
  for (const m2 of m.dest) {
    m2.received.push(false);
    m.receiverIndex = m2.received.length - 1;
  }
}
console.log(list);

// LESSON: there's a ton of back propagation, the
// quest for isolated "machines" would be difficult.
//
// ***
//
// I need to detect back propagation, e.g.
// work out where the layers are so I can move
// towards identifying islands I can simulate
// cheaply.
//
// button -> broadcaster (layer 0)
// broadcaster -> a, b, c (layer 1)
// a->whatever, b->whatever, c->whatever (layer 2)
//
// increment the layer count as I go, unless
// already set
//
// if I get a pointer to a node with a layer number
// that is *less than* or *equal to* the current
// layer number then we have back propagation ):

// findLayers(modules.get('button'));
// console.log('layer check complete');
// console.log(Math.max(...list.map(m => m.layer || 0)));

// function findLayers(m) {
//   for (const name of m.dest) {
//     let m2 = modules.get(name);
//     if (!m2) {
//       // Because he likes to introduce unregistered
//       // modules at random I guess
//       m2 = {
//         name,
//         type: '',
//         dest: []
//       };
//       modules.set(name, m2);
//     }
//     if (m2.layer !== undefined) {
//       if (m2.layer < (m.layer + 1)) {
//         console.log(`Back propagation: ${m.name} ${m.layer} cycles back to ${m2.name} ${m2.layer}`);
//         continue;
//       }
//     } else {
//       m2.layer = m.layer + 1;
//     }
//     findLayers(m2);
//   }
// }

let sentHigh = 0;
let sentLow = 0;

let first, last;

console.log(solve());

function solve() {
  let i = 1;
  while (true) {
    if (!(i % 1000000)) {
      console.log(i);
      console.log(sentLow, sentHigh);
      process.exit(0);
    }
    i++;

    first = null;
    last = null;

    send(button, false);
    
    while (first) {
      const pulse = first;
      first = pulse.next;
      let m = pulse.dest;
      const value = pulse.value;
      if (value) {
        sentHigh++;
      } else {
        sentLow++;
      }
      if ((m.name === 'rx') && !pulse.value) {
        return i;
      }
      if (m.type === '') {
        send(m, value);
      } else if (m.type === '%') {
        if (!value) {
          m.state = !m.state;
          send(m, m.state);
        }
      } else if (m.type === '&') {
        let next = false;
        m.received[pulse.receiverIndex] = pulse.value;
        if (m.received.includes(false)) {
          next = true;
        }
        send(m, next);
      }
    }
    last = null;
  }
}

function send(m, value) {
  for (const d of m.dest) {
    const pulse = {
      dest: d,
      value,
      receiverIndex: m.receiverIndex
    };
    if (last) {
      last.next = pulse;
    }
    last = pulse;
    if (!first) {
      first = pulse;
    }
  }
}

// &inv -> a
function parseModule(s) {
  const [ , type, name, dest ] = s.match(/^([%&]?)([a-z]+) -> (.*)$/);
  return {
    type,
    name,
    state: false,
    dest: dest.split(', ')
  }
}
