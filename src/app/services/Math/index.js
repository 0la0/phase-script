const UUID_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const XY_REGEX = /[xy]/g;

function getPosNeg() {
  return Math.random() < 0.5 ? -1 : 1;
}

function IntArray(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return arr;
}

function generateRandomChars(input) {
  const r = Math.random() * 16 | 0;
  const v = input === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
}

function uuid() {
  return UUID_TEMPLATE.replace(XY_REGEX, generateRandomChars);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export { getPosNeg, IntArray, uuid, clamp };
