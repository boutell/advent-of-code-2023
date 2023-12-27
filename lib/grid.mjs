class Grid {
  constructor(data) {
    if (data) {
      this.data = data;
      this.height = data.length;
      this.width = data[0].length;
      this.top = 0;
      this.left = 0;
      this.right = this.width - 1;
      this.bottom = this.height - 1;
    }
  }
  // Returns an iterator over the cells in the grid
  cells() {
    const self = this;
    function* generate() {
      for (let y = self.top; (y <= self.bottom); y++) {
        for (let x = self.left; (x <= self.right); x++) {
          yield self.get(x, y);
        }
      }
    }
    return generate();
  }
  // Returns a cell, with a "value" setter and getter and
  // useful iterators for accessing neighbors
  get(x, y) {
    if (!this.inBounds(x, y)) {
      throw new Error(`Out of bounds at ${x} ${y}`);
    }
    return new Cell(this, x, y);
  }
  // Get just the value
  getValue(x, y) {
    if (!this.inBounds(x, y)) {
      throw new Error(`Out of bounds at ${x} ${y}`);
    }
    return this.data[y][x];
  }
  // More convenient than .get(x, y).value = v
  setValue(x, y, value) {
    if (!this.inBounds(x, y)) {
      throw new Error(`Out of bounds at ${x} ${y}`);
    }
    this.data[y][x] = value;
  }
  inBounds(x, y) {
    if ((typeof x) !== 'number') {
      throw new Error('x is not a number:', x);
    }
    if ((typeof y) !== 'number') {
      throw new Error('y is not a number:', x);
    }
    if ((y < this.top) || (y > this.bottom)) {
      return false;
    }
    if ((x < this.left) || (x > this.right)) {
      return false;
    }
    return true;
  }
  print(format = (v) => v || ' ') {
    for (let y = this.top; (y <= this.bottom); y++) {
      let s = '';
      for (let x = this.left; (x <= this.right); x++) {
        s += format(this.getValue(x, y));
      }
      console.log(s);
    }
  }
  // The value of each cell must be a mutable object.
  // The value of the starting cell must have a
  // numeric "d" property usually starting at zero. isWalkable
  // must return true when given a value that is considered
  // "walkable" (not a wall, etc). Upon return, every
  // reachable walkable cell's value has an integer
  // "d" property
  shortestPath(isWalkable) {
    let change;
    do {
      change = false;
      for (const cell of this.cells()) {
        if ((typeof cell.value.d) === 'number') {
          for (const n of cell.taxi()) {
            const value = n.value;
            if (isWalkable(value) && (((typeof value.d) !== 'number') || (value.d > cell.value.d + 1))) {
              value.d = cell.value.d + 1;
              change = true;
            }
          }
        }
      }
    } while (change);
  }
}

// Cell objects are returned by grid.get() and offer
// a convenient .value getter and setter as well
// as iterators over neighboring cells

class Cell {
  constructor(grid, x, y) {
    this.grid = grid;
    this.x = x;
    this.y = y;
  }
  get value() {
    return this.grid.getValue(this.x, this.y);
  }
  set value(v) {
    this.grid.setValue(this.x, this.y, v);
  }
  // Returns an iterator over the neighboring cells
  neighbors() {
    const self = this;
    function* generate() {
      for (let y = self.y - 1; (y <= self.y + 1); y++) {
        for (let x = self.x - 1; (x <= self.x + 1); x++) {
          if ((y === self.y) && (x === self.x)) {
            continue;
          }
          if (!self.grid.inBounds(x, y)) {
            continue;
          }
          yield self.grid.get(x, y);
        }
      }
    }
    return generate();
  }
  // Like neighbors, but for taxicab directions only
  // (no diagonals)
  taxi() {
    const self = this;
    const dirs = [
      [ 0, -1 ],
      [ 1, 0 ],
      [ 0, 1 ],
      [ -1, 0 ]
    ];
    function* generate() {
      for (const [xd, yd ] of dirs) {
        const x = self.x + xd;
        const y = self.y + yd;
        if (!self.grid.inBounds(x, y)) {
          continue;
        }
        yield self.grid.get(x, y);
      }
    }
    return generate();
  }
  // Returns an iterator over all cells in a given direction.
  // Use -1, 0 to walk left, etc.
  walkFrom(dx, dy) {
    // "this" isn't bound inside generate()
    const self = this;
    function* generate() {
      let x = self.x + dx;
      let y = self.y + dy;
      while (self.grid.inBounds(x, y)) {
        yield self.grid.get(x, y);
        x += dx;
        y += dy;
      }
    }
    return generate();
  }
  // Return the adjoining cell in the given direction.
  // Returns false if the direction is out of bounds
  step(dx, dy) {
    let x = this.x + dx;
    let y = this.y + dy;
    if (!this.grid.inBounds(x, y)) {
      return false;
    }
    return this.grid.get(x, y);
  }
}

export default Grid;
