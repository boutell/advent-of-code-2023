import { readFileSync } from 'fs';
import Queue from './lib/queue.mjs';

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

// Shows that every node is involved in rx, and also
// we have cycles

// const rx = list.find(m => m.name === 'rx');
// findLinks(rx);
// for (const m of list) {
//   console.log(`${m.name}: ${m.inputs ? m.inputs.join(', ') : 'NO'}`);
// }
// process.exit(0);

// function findLinks(m) {
//   const inputs = list.filter(m2 => m2.dest.includes(m.name));
//   m.inputs = inputs.map(m2 => m2.name);
//   for (const m2 of inputs) {
//     if (m2.inputs) {
//       console.log(`Cycle at ${m2.name}`);
//       continue;
//     }
//     findLinks(m2);
//   }
// }

const feedsRx = list.filter(m => m.dest.includes('rx')).map(m => m.name);
const feedsRx2 = list.filter(m => m.dest.find(d => feedsRx.includes(d))).map(m => m.name);

for (const m of list) {
  m.received = [];
  m.last = false;
}
for (const m of list) {
  m.dest = m.dest.map(name => list.find(m => m.name === name));
  m.dest = m.dest.map(m2 => {
    m2.received.push(false);
    return [ m2, m2.received.length - 1 ];
  });
}

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
let pulses;

console.log(solve());

function solve() {
  let i = 0;
  while (true) {
    if (!(i % 1000000)) {
      console.log(i);
    }
    i++;

    pulses = new Queue();

    send(button, false);
    
    while (!pulses.empty()) {
      const pulse = pulses.dequeue();
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
        if (!next) {
          if (feedsRx2.includes(m.name)) {
            console.log(`${m.name} ${i - m.last}`);
            m.last = i;
          }
        }      
        send(m, next);
      }
    }
  }
}

function send(m, value) {
  for (const [ d, index ] of m.dest) {
    const pulse = {
      dest: d,
      value,
      receiverIndex: index
    };
    pulses.enqueue(pulse);
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
