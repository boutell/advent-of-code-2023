// min heap
export default class Heap {
  constructor(comparator) {
    this.comparator = comparator || ((a, b) => a - b);
    this.data = [];
  }
  insert(v) {
    const index = this.data.length;
    this.data.push(v);
    this.swim(index);
  }
  remove() {
    const v = this.data[0];
    this.data[0] = this.data[this.data.length - 1];
    this.sink(0);
    this.data.splice(this.data.length - 1, 1);
    return v;
  }
  swim(i) {
    const pi = i >> 1;
    if (this.comparator(this.data[i], this.data[pi]) < 0) {
      this.swap(i, pi);
      this.swim(pi);
    }
  }
  sink(i) {
    const li = i << 1;
    const ri = li + 1;
    if (this.comparator(this.data[i], this.data[li]) > 0) {
      this.swap(i, li);
      this.sink(li);
    }
    if (this.comparator(this.data[i], this.data[ri]) > 0) {
      this.swap(i, ri);
      this.sink(ri);
    }
  }
  swap(a, b) {
    const t = this.data[a];
    this.data[a] = this.data[b];
    this.data[b] = t;
  }
}