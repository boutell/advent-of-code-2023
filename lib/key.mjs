export default function key(...args) {
  return JSON.stringify(
    args,
    (_key, value) => (value instanceof Set ? [...value] : value)
  );
};
