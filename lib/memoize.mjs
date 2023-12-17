export default function memoize(fn) {
  const memos = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (memos.has(key)) {
      console.log('hit');
      return memos.get(key);
    }
    const result = fn(...args);
    memos.set(key, result);
    return result;
  };
}