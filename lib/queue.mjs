export default class Queue {
  constructor() {
    this.first = null;
    this.last = null;
  }
  enqueue(value) {
    const node = {
      value
    };
    if (this.last) {
      this.last.next = node;
    }
    this.last = node;
    if (!this.first) {
      this.first = node;
    }
  }
  dequeue() {
    const node = this.first;
    if (!node) {
      throw new Error('shift called on empty list');
    }
    this.first = node.next;
    if (!this.first) {
      this.last = null;
    }
    return node.value;
  }
  empty() {
    return !this.first;
  }
}
