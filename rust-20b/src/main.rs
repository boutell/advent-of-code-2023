use std::fs::read_to_string;
use std::collections::HashMap;
use regex::Regex;

const BROADCASTER: i32 = 1;
const FLIPFLOP: i32 = 2;
const CONJUNCTION: i32 = 3;

#[derive(Clone)]
struct Receiver {
  name: String,
  module_index: usize,
  sender_index: usize
}

#[derive(Clone)]
struct Module {
  name: String,
  t: i32,
  receivers: Vec<Receiver>,
  received: Vec<bool>
}

fn read_lines(filename: &str) -> Vec<String> {
  read_to_string(filename) 
    .unwrap()  // panic on possible file-reading errors
    .lines()  // split the string into an iterator of string slices
    .map(String::from)  // make each slice into a string
    .collect()  // gather them together into a vector
}

fn main() {
  let mut lines = read_lines("/dev/stdin");
  lines.push("button -> broadcaster".to_owned());
  let mut modules: Vec<Module> = lines
    .iter()
    .map(parse_module)
    .collect();
  let mut new_modules: Vec<Module> = vec![];

  for m in modules.iter() {
    for r in m.receivers.iter() {
      // he introduces rando modules sometimes
      if !modules.iter().any(|m| m.name == r.name) {
        let m2 = Module {
          name: r.name.clone(),
          t: BROADCASTER,
          receivers: vec![],
          received: vec![]
        };
        new_modules.push(m2);
      }
    }
  }

  modules.append(&mut new_modules);

  let copy = modules.clone();

  for m in copy.iter() {
    for m2 in modules.iter_mut() {
      if m.receivers.iter().any(|r| r.name == m2.name) {
        m2.received.push(false);
      }
    }
  }

  let mut receiver_counts = HashMap::new();

  for m in modules.iter_mut() {
    let mut n = 0;
    for m2 in copy.iter() {
      if m.receivers.iter().any(|r| r.name == m2.name) {
        let receiver = m.receivers.iter_mut().find(|r| r.name == m2.name);
        match receiver {
          Some(receiver) => {
            receiver.module_index = n;
            let si = receiver_counts.get(&m2.name);
            match si {
              Some(si) => {
                receiver.sender_index = *si;
                receiver_counts.insert(m2.name.clone(), si + 1);
              },
              None => {
                receiver_counts.insert(m2.name.clone(), 1);
              }
            }
          },
          None => panic!("Unable to find receiver")
        };
      }
      n += 1;
    }
  }

  for module in modules.iter() {
    println!(
      "Module Name: {} Type: {}",
      module.name,
      module.t
    );
    for receiver in module.receivers.iter() {
      describe_receiver(&receiver);
    }
  }
}

fn parse_module(line: &String) -> Module {

  let re = Regex::new(r"^(?<type>[%&]?)(?<name>[a-z]+) -> (?<receivers>.*)$").unwrap();
  let Some(caps) = re.captures(line) else {
    panic!("regex match failed");
  };
  let receiver_names = caps["receivers"].split(", ");
  let receivers = receiver_names.map(receiver_from_name).collect();
  let t: i32;
  if caps["type"].to_owned() == "%" {
    t = FLIPFLOP;
  } else if caps["type"].to_owned() == "&" {
    t = CONJUNCTION;
  } else {
    t = BROADCASTER;
  }
  Module {
    name: caps["name"].to_owned(),
    t,
    receivers,
    received: vec![]
  }
}

fn receiver_from_name(name: &str) -> Receiver {
  Receiver {
    name: name.to_owned(),
    // These values will be replaced by
    // true ones
    module_index: 0,
    sender_index: 0
  }
}

fn describe_receiver(receiver: &Receiver) {
  println!("Receiver Name: {} Module Index: {} Sender Index: {}", receiver.name, receiver.module_index, receiver.sender_index);
}
