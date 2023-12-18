import Heap from './lib/heap.mjs';

const data = [];
for (let i = 0; (i < 100); i++) {
  const index = Math.floor(data.length * Math.random());
  data.splice(index, 0, i);
}
const heap = new Heap();
for (const v of data) {
  heap.insert(v);
}
for (let i = 0; (i < 100); i++) {
  const v = heap.remove();
  if (i !== v) {
    console.error(heap.data);
    throw new Error(`Got ${v} expected ${i}`);
  }
}
console.log(heap.data);