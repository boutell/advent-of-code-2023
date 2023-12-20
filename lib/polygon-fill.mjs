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
      const diff = intersect(a, y) - intersect(b, y);
      if (diff === 0) {
        // Sort horizontal lines last
        if (isHorizontal(a) && !isHorizontal(b)) {
          return 1;
        } else if (isHorizontal(b) && !isHorizontal(a)) {
          return -1;
        } else {
          return 0;
        }
      }
      return diff;
    });
    let lastHorizontal = false;
    let last = false;
    for (const edge of list) {
      if (edge.y1 === edge.y2) {
        lastHorizontal = true;
        // No matter what the horizontal line itself must be drawn
        ystrokes.push({
          y,
          x1: Math.min(edge.x1, edge.x2),
          x2: Math.max(edge.x1, edge.x2)
        });
        continue;
      }
      if (lastHorizontal) {
        if (last) {
          const lmin = Math.min(last.y1, last.y2);
          const min = Math.min(edge.y1, edge.y2);
          if ((lmin === y) !== (min === y)) {
            // one extends above, the other extends below;
            // treat this like a continuation of the first line
            // after a horizontal detour
            last = edge;
            lastHorizontal = false;
            continue;
          }
        }
      }
      const x = intersect(edge, y);
      if (inside) {
        ystrokes.push({
          y,
          x1: px,
          x2: x
        });
      }
      inside = !inside;
      px = x;
      lastHorizontal = false;
      last = edge;
    }
    ystrokes.sort((a, b) => a.x1 - b.x1);
    for (const stroke of ystrokes) {
      push(stroke);
    }
  }
  return strokes;
  function push(s) {
    if (last) {
      // Deal with overlap caused by the logic to ensure
      // horizontal lines get drawn
      if (last.y === s.y) {
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

function isHorizontal({ y1, y2 }) {
  return y1 === y2;
}