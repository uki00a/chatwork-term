export const numberOfLines = s => s.split(/\n/).length || 1;
export const findLast = (array, predicate) => {
  for (let i = array.length - 1; i > -1; --i) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
};
export const first = array => array[0];
export const last = array => array[array.length - 1];
export const butLast = array => array.slice(0, -1);
export const removeLastChar = s => {
  return s.substring(0, s.length - 1);
};
