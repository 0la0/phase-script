import { mtof, ftom } from 'services/midi/util';

function intArray(base, length) {
  const arr = [];
  for (let i = base; i < base + length; i++) {
    arr.push(i);
  }
  return arr;
}

function range(...args) {
  if (!args.length) {
    throw new Error('range requires at least one argument');
  }
  if (args.length === 1 && Number.isInteger(args[0])) {
    return intArray(0, args[0]);
  }
  if (Number.isInteger(args[0]) && Number.isInteger(args[1])) {
    const length = Math.abs(args[1] - args[0]);
    if (args[1] > args[0]) {
      return intArray(args[0], length).reverse();
    }
    return intArray(args[0], length);
  }
  throw new Error('range requires one or two integers');
}

function buildUtilFunction(name, fn) {
  return { [name]: function(...args) {
    return fn(...args);
  } }[name];
}

export const utilApi = [
  {
    name: 'mtof',
    fn: buildUtilFunction('mtof', mtof)
  },
  {
    name: 'ftom',
    fn: buildUtilFunction('ftom', ftom)
  },
  {
    name: 'range',
    fn: buildUtilFunction('range', range)
  }
];
