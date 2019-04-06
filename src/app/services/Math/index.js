const UUID_TEMPLATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const XY_REGEX = /[xy]/g;

export function getPosNeg() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function IntArray(length) {
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

export function uuid() {
  return UUID_TEMPLATE.replace(XY_REGEX, generateRandomChars);
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function floatingPrecision(num, precision) {
  if (typeof num !== 'number') {
    throw new Error('Input must be a number');
  }
  const muliplier = 10 ** precision;
  return Math.round(num * muliplier) / muliplier;
}

export function mapToRange(inputMin, inputMax, outputMin, outputMax, x) {
  return (x - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
}

export function msToSec(ms) {
  return ms / 1000;
}
