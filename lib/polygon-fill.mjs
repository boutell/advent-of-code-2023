// Returns an array of horizontal strokes with
// y, x1, and x2 properties

export default function fill(edges) {
  const top = edges.reduce((a, e) => Math.min(e.y1, e.y2, a), Number.POSITIVE_INFINITY);
  const bottom = edges.reduce((a, e) => Math.max(e.y1, e.y2, a), Number.NEGATIVE_INFINITY);
  const left = edges.reduce((a, e) => Math.min(e.x1, e.x2, a), Number.POSITIVE_INFINITY);
  const right = edges.reduce((a, e) => Math.max(e.x1, e.x2, a), Number.NEGATIVE_INFINITY);
  const strokes = [];
  let last = null;
  for (let y = top; (y <= bottom); y++) {
    const ystrokes = [];
    let inside = false;
    let px = false;
    const list = edges.filter(e => intersect(e, y) !== false);
    list.sort((a, b) => {
      return intersect(a, y) - intersect(b, y);
    });
    if (y === 5) {
      console.log('INTERSECTS:', list.map(e => intersect(e, y)));
      console.log('EDGES:', list);
    }
    for (const edge of list) {
      let x;
      if (edge.y1 === edge.y2) {
        const x1 = Math.min(edge.x1, edge.x2);
        const x2 = Math.max(edge.x1, edge.x2);
        x = x1;
        ystrokes.push({
          y,
          x1,
          x2 
        });
      } else {
        x = intersect(edge, y);
      }
      if (inside) {
        ystrokes.push({
          y,
          x1: px,
          x2: x
        });
      }
      inside = !inside;
      px = x;
    }
    ystrokes.sort((a, b) => a.x1 - b.x1);
    for (const stroke of ystrokes) {
      push(stroke);
    }
  }
  return strokes;
  function push(s) {
    if (last) {
      if (last.y === s.y) {
        if ((last.x1 === s.x1) && (last.x2 === s.x2)) {
          return;
        }
        if (s.x1 <= last.x2) {
          s.x1 = last.x2 + 1;
        }
        if (s.x1 > s.x2) {
          return;
        }
      }
    }
    strokes.push(s);
    last = s;
  }
}

function intersect(edge, y) {
  const y1 = Math.min(edge.y1, edge.y2);
  const y2 = Math.max(edge.y1, edge.y2);
  const x1 = Math.min(edge.x1, edge.x2);
  const x2 = Math.max(edge.x1, edge.x2);
  if ((y < y1) || (y > y2)) {
    return false;
  }
  if (y1 === y2) {
    return x1;
  }
  const scale = (y - y1) / (y2 - y1);
  const x = edge.x1 + (edge.x2 - edge.x1) * scale;
  return x;
}
