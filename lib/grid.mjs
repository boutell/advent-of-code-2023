class Grid {
  constructor(data) {
    this.data = data;
    this.height = data.length;
    this.width = data[0].length;
  }
  // Returns an iterator over the cells in the grid
  cells() {
    const self = this;
    function* generate() {
      for (let y = 0; (y < self.data.length); y++) {
        for (let x = 0; (x < self.data[y].length); x++) {
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
    if ((y < 0) || (y >= this.data.length)) {
      return false;
    }
    if ((x < 0) || (x >= this.data[y].length)) {
      return false;
    }
    return true;
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
