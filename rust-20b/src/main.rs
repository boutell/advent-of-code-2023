use std::fs::read_to_string;
use regex::Regex;

const BROADCASTER: i32 = 1;
const FLIPFLOP: i32 = 2;
const CONJUNCTION: i32 = 3;

struct Receiver {
  name: String,
  module_index: usize,
  sender_index: usize
}

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
  let mut newModules: Vec<Module> = vec![];

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
        newModules.push(m2);
      }
    }
  }

  modules.append(&mut newModules);

  let mut i = 0;
  while i < modules.len() {
    let mut j = 0;
    while j < modules.len() {
      if i == j {
        continue;
      }
      let m = &mut modules[i];
      let m2 = &mut modules[j];
      let receiver = m.receivers.iter_mut().find(|r| r.name == m2.name);
      match receiver {
        Some(receiver) => {
          receiver.module_index = j;
          m2.received.push(false);
          receiver.sender_index = m2.received.len() - 1;
        },
        None => panic!("Unable to find receiver")
      };
      j = j + 1;
    }
    i = i + 1;
  }

  for module in modules.iter() {
    println!("Module Name: {} Type: {}",
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
