export default function splitOnBlank(lines) {
    const output = [];
    let next = [];
    for (const row of lines) {
      if (!row.length) {
        if (next.length) {
          output.push(next);
          next = [];
        }
      } else {
        next.push(row);
      }
    }
    if (next.length) {
      output.push(next);    
    }
    return output;
  }