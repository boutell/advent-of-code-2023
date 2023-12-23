#include <fstream>
#include <string>
#include <list>

using namespace std;

void readFile(const char* filename, list<string>& lines) {
  lines.clear();
  ifstream file(filename);
  string s;
  while (getline(file, s)) {
    if (s.length() > 0) {
      lines.push_back(s);
    }
  }
}

typedef struct {
  string name;
  Mod &d;
  int index;
} Receiver;

class Mod {
  string name;
  Type type;
  list<Receiver> receivers;
  list<bool> received;
};

typedef struct {
} mod;

int main() {
  list<string> lines;
  readFile("/dev/stdin", lines);
  printf("read %d lines\n", lines.size());
  list<module> modules;
  for (string it = lines.begin(); it != lines.end(); ++it) {
    modules.push_back(parse_module(it));
  }
  module button = {
    map(parse_module);
  let button = 
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
  m.dest = m.dest.map(m2 => {
    m2.received.push(false);
    return [ m2, m2.received.length - 1 ];
  });
}
console.log(list);

let sentHigh = 0;
let sentLow = 0;
let pulses;

console.log(solve());

function solve() {
  let i = 0;
  while (true) {
    i++;
    if (!(i % 1000000)) {
      console.log(i);
    }

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

        // This is .1s faster than calling .includes
        const r = m.received;
        r[pulse.receiverIndex] = pulse.value;
        for (let i = 0; (i < r.length); i++) {
          if (r[i] === false) {
            next = true;
            break;
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
