// Returns an array of horizontal strokes with
// y, x1, and x2 properties

export default function fill(edges) {
  console.log(edges);
  const top = edges.reduce((a, e) => Math.min(e.y1, e.y2, a), Number.POSITIVE_INFINITY);
  const bottom = edges.reduce((a, e) => Math.max(e.y1, e.y2, a), Number.NEGATIVE_INFINITY);
  const left = edges.reduce((a, e) => Math.min(e.x1, e.x2, a), Number.POSITIVE_INFINITY);
  const right = edges.reduce((a, e) => Math.max(e.x1, e.x2, a), Number.NEGATIVE_INFINITY);
  console.log(top, bottom, left, right);
  const strokes = [];
  for (let y = top; (y <= bottom); y++) {
    let inside = false;
    let px = false;
    const list = edges.filter(e => intersect(e, y) !== false);
    list.sort((a, b) => {
      return intersect(a, y) - intersect(b, y);
    });
    for (const edge of list) {
      if (edge.y1 === edge.y2) {
        push({
          y,
          x1: Math.min(edge.x1, edge.x2),
          x2: Math.max(edge.x1, edge.x2)
        });
      } else {
        const x = intersect(edge, y);
        if (inside) {
          push({
            y,
            x1: px,
            x2: x
          });
        }
        inside = !inside;
        px = x;
      }
    }
  }
  return strokes;
  function push(s) {
    if (strokes.length > 0) {
      if (JSON.stringify(strokes[strokes.length - 1]) === JSON.stringify(s)) {
        return;
      }
    }
    strokes.push(s);
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
  console.log({
    edge,
    scale,
    x,
    y   
  });
  return x;
}
