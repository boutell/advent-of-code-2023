import { readFileSync } from 'fs';
import splitOnBlank from './lib/split-on-blank.mjs';

const input = readFileSync('/dev/stdin', 'utf8');
const lines = input.split('\n');

const [ workflowLines, partLines ] = splitOnBlank(lines);

const workflowList = workflowLines.map(parseWorkflow);
const workflows = Object.fromEntries(workflowList.map(workflow => [ workflow.name, workflow ]));

const conditionSets = findConditionSets(workflows.in.rules);
// console.log(JSON.stringify(conditionSets, null, '  '));

const operators = {
  '<'(a, b) {
    return a < b;
  },
  '>'(a, b) {
    return a > b;
  }
};

const vars = [ 'x', 'm', 'a', 's' ];
let total = 0;
for (const set of conditionSets) {
  let combinations = 1;
  for (const v of vars) {
    let allowed = 0;
    for (let i = 1; (i <= 4000); i++) {
      let ok = true;
      for (const condition of set) {
        if (condition.v === v) {
          let result = operators[condition.operator](i, condition.value);
          if (condition.not) {
            result = !result;
          }
          if (!result) {
            ok = false;
            break;
          }
        }
      }
      if (ok) {
        allowed++;
      }
    }
    combinations *= allowed;
  }
  total += combinations;
}
console.log(total);

function findConditionSets(rules) {
  const not = [];
  const paths = [];
  const rule = rules[0];
  if (rule.dest === 'A') {
    if (rule.operator) {
      const subsets = findConditionSets(rules.slice(1));
      return [
        [
          {
            v: rule.v,
            operator: rule.operator,
            value: rule.value
          },
          {
            accept: true
          }
        ],
        ...subsets.map(set => [
          {
            not: true,
            v: rule.v,
            operator: rule.operator,
            value: rule.value
          },
          ...set
        ])
      ];
    } else {
      return [
        [
          {
            accept: true
          }
        ]
      ];
    }
  } else if (rule.dest === 'R') {
    if (rule.operator) {
      const subsets = findConditionSets(rules.slice(1));
      return subsets.map(set =>
        [
          {
            not: true,
            v: rule.v,
            operator: rule.operator,
            value: rule.value
          },
          ...set
        ]
      );
    } else {
      return [];
    }
  } else {
    if (rule.operator) {
      return [
        ...findConditionSets(workflows[rule.dest].rules).map(set =>
          [
            {
              v: rule.v,
              operator: rule.operator,
              value: rule.value
            },
            ...set
          ]
        ),
        ...findConditionSets(rules.slice(1)).map(set =>
          [
            {
              not: true,
              v: rule.v,
              operator: rule.operator,
              value: rule.value
            },
            ...set
          ]
        )
      ];
    } else {
      return findConditionSets(workflows[rule.dest].rules);
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
      value: +value,
      dest
    };
  }
  return {
    dest: s
  };
}
