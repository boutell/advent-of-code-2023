import { readFileSync } from 'fs';
import splitOnBlank from './lib/split-on-blank.mjs';

const operators = {
  '<'(a, b) {
    return a < b;
  },
  '>'(a, b) {
    return a > b;
  }
};

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n');

const [ workflowLines, partLines ] = splitOnBlank(lines);

const workflowList = workflowLines.map(parseWorkflow);
const workflows = Object.fromEntries(workflowList.map(workflow => [ workflow.name, workflow ]));
const parts = partLines.map(parsePart);

const accepted = [];
const rejected = [];

for (const part of parts) {
  const result = processPart(part);
  if (result === 'A') {
    accepted.push(part);
  } else {
    rejected.push(part);
  }
}

console.log(accepted.reduce((a, part) => {
  Object.values(part).forEach(value => {
    a += value;
  });
  return a;
}, 0));

function processPart(part) {
  let workflowName = 'in';
  while (true) {
    const workflow = workflows[workflowName];
    for (const rule of workflow.rules) {
      if (!rule.operator || evaluateTest(rule, part)) {
        if ((rule.dest === 'A') || (rule.dest === 'R')) {
          return rule.dest;
        }
        workflowName = rule.dest;
        break;
      }
    }
  }
}

// px{a<2006:qkq,m>2090:A,rfg}
function parseWorkflow(line) {
  const [ , name, rulesText ] = line.match(/^([a-z]+){(.*)?}$/);
  const rules = rulesText.split(',').map(parseRule);
  return {
    name,
    rules
  };
}

function parseRule(s) {
  if (s.includes(':')) {
    const [ test, dest ] = s.split(':');
    const [ , v, operator, value ] = test.match(/^([a-z])([\<\>])(\d+)$/);
    return {
      v,
      operator,
      value,
      dest
    };
  }
  return {
    dest: s
  };
}

// {x=787,m=2655,a=1222,s=2876}
function parsePart(s) {
  s = s.replace(/[{}]/g, '');
  const values = {};
  const exps = s.split(',');
  for (const exp of exps) {
    const [ name, value ] = exp.split('=');
    values[name] = +value;
  }
  return values;
}

function evaluateTest(rule, part) {
  console.log(rule, part);
  return operators[rule.operator](part[rule.v], rule.value);
}