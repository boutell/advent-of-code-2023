import Grid from './grid.mjs';
import key from './key.mjs';

export default class SparseGrid extends Grid {
  constructor(data) {
    super();
    this.map = new Map();
    this.top = false;
    this.left = false;
    this.right = false;
    this.bottom = false;
    if (data) {
      for (y = 0; (y < data.length); y++) {
        for (x = 0; (x < data[y].length); x++) {
          this.setValue(x, y, data[y][x]);
        }
      }      
    }
  }
  inBounds(x, y) {
    return true;
  }
  setValue(x, y, v) {
    if (this.left === false) {
      this.left = x;
      this.right = x;
      this.top = y;
      this.bottom = y;
    } else {
      if (x < this.left) {
        this.left = x;
      }
      if (x > this.right) {
        this.right = x;
      }
      if (y < this.top) {
        this.top = y;
      }
      if (y > this.bottom) {
        this.bottom = y;
      }
    }
    this.map.set(key(x, y), v);
  }
  getValue(x, y) {
    return this.map.get(key(x, y));
  }
  get width() {
    if (this.left === false) {
      return 0;
    }
    return this.right - this.left + 1;
  }
  get height() {
    if (this.left === false) {
      return 0;
    }
    return this.bottom - this.top + 1;
  }
}