import { readFileSync } from 'fs';
const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);
const list = lines.map(parseModule);
const modules = new Map();
const button = {
  name: 'button',
  type: '',
  dest: [ 'broadcaster' ]
};
list.push(button);
const output = {
  name: 'output',
  type: '',
  dest: []
};
list.push(output);
for (const m of list) {
  modules.set(m.name, m);
}
for (const m of list) {
  if (m.type === '&') {
    const senders = list.filter(m2 => m2.dest.includes(m.name)).map(m2 => m2.name);
    for (const sender of senders) {
      m.memory.set(sender, false);
    }
  }
}

let sentHigh = 0;
let sentLow = 0;

let pulses;

for (let i = 1; (i <= 1000); i++) {

  pulses = [];

  send(modules.get('button'), false);
  
  while (pulses.length > 0) {
    const pulse = pulses.shift();
    const sender = pulse.sender;
    let m = modules.get(pulse.dest);
    if (!m) {
      // Because he likes to introduce unregistered
      // modules at random I guess
      m = {
        name: pulse.dest,
        type: '',
        dest: []
      };
      modules.set(pulse.dest, m);
    }
    const value = pulse.value;
    if (value) {
      sentHigh++;
    } else {
      sentLow++;
    }
    if (m.type === '') {
      send(m, value);
    } else if (m.type === '%') {
      if (!value) {
        m.state = !m.state;
        send(m, m.state);
      }
    } else if (m.type === '&') {
      m.memory.set(sender, value);
      let next = false;
      for (const v of m.memory.values()) {
        if (!v) {
          next = true;
        }
      }
      send(m, next);
    }
  }
}

console.log(sentLow, sentHigh, sentLow * sentHigh);

function send(m, value) {
  for (const name of m.dest) {
    pulses.push({
      dest: name,
      value,
      sender: m.name
    });
  }
}

// &inv -> a
function parseModule(s) {
  const [ , type, name, dest ] = s.match(/^([%&]?)([a-z]+) -> (.*)$/);
  return {
    type,
    name,
    state: false,
    memory: new Map(),
    dest: dest.split(', ')
  }
}
