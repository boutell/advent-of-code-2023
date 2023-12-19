export default function flood(grid, x, y, test, paintWith) {
  let change;
  let next = [
    grid.get(x, y)
  ];
  do {
    change = false;
    for (const cell of next) {
      if (test(cell.value)) {
        cell.value = paintWith;
        change = true;
        for (const n of cell.neighbors()) {
          if (test(n.value)) {
            next.push(n);
          }
        }
      }
    }
  } while (change);
}
