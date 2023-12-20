export default function flood(grid, x, y, test, paintWith) {
  let change;
  let next = [
    grid.get(x, y)
  ];
  let n = 0;
  do {
    change = false;
    for (const cell of next) {
      if (test(cell.value)) {
        cell.value = paintWith;
        n++;
        if (!(n % 1000)) {
          console.log(n);
        }
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
