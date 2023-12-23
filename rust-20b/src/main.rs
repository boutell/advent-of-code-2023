use std::fs::read_to_string;
use regex::Regex;

const BROADCASTER: i32 = 1;
const FLIPFLOP: i32 = 2;
const CONJUNCTION: i32 = 3;

struct Receiver {
  name: String,
  module_index: i32,
  sender_index: i32
}

struct Module {
  name: String,
  t: i32,
  receivers: Vec<Receiver>
}

fn read_lines(filename: &str) -> Vec<String> {
  read_to_string(filename) 
    .unwrap()  // panic on possible file-reading errors
    .lines()  // split the string into an iterator of string slices
    .map(String::from)  // make each slice into a string
    .collect()  // gather them together into a vector
}

fn main() {
  let lines = read_lines("/dev/stdin");
  let modules: Vec<Module> = lines
    .iter()
    .map(parse_module)
    .collect();
  for module in modules.iter() {
    println!(
      "Name: {} Type: {} Receivers: {}",
      module.name,
      module.t,
      module.receivers
        .iter()
        .map(get_receiver_name)
        .collect::<Vec<String>>()
        .join(":")
    );
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
    receivers
  }
}

fn receiver_from_name(name: &str) -> Receiver {
  Receiver {
    name: name.to_owned(),
    module_index: -1,
    sender_index: -1
  }
}

fn get_receiver_name(receiver: &Receiver) -> String {
  return receiver.name.clone();
}
