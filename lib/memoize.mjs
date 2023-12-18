import key from './key.mjs';

export default function memoize(fn) {
  const memos = new Map();
  return (...args) => {
    const k = key(args);
    if (memos.has(k)) {
      return memos.get(k);
    }
    const result = fn(...args);
    memos.set(k, result);
    return result;
  };
}