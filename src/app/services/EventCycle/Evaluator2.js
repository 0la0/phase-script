import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';
import RepeatHandler from 'services/EventCycle/Pattern/RepeatHandler';
import ReverseHandler from 'services/EventCycle/Pattern/ReverseHandler';
import OffsetHandler from 'services/EventCycle/Pattern/OffsetHandler';
import RotateHandler from 'services/EventCycle/Pattern/RotateHandler';
import BreakHandler from 'services/EventCycle/Pattern/BreakHandler';
import SpeedHandler from 'services/EventCycle/Pattern/SpeedHandler';

function pattern(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`Illegal Argument: string required for pattern(${str})`);
  }
  return new PatternHandler(str);
}
function p(str) {
  return pattern(str);
}

function reverse(pattern) {
  if (!(pattern instanceof BaseHandler)) {
    throw new TypeError(`Illegal Argument: pattern required for reverse(${pattern})`);
  }
  return new ReverseHandler(pattern);
}
function rev(pattern) {
  return reverse(pattern);
}

function repeat(num) {
  if (!Number.isInteger(num)) {
    throw new TypeError(`Illegal Argument: integer required for repeat(${num})`);
  }
  const repeatHof = pattern => new RepeatHandler(num, pattern);
  console.log('repeatHof', num, repeatHof)
  return repeatHof;
}
function rep(num) {
  return repeat(num);
}

function speed(speed) {
  if (Number.isNaN(speed)) {
    throw new TypeError(`Illegal Argument: float required for speed(${speed})`);
  }
  return pattern => new SpeedHandler(speed, pattern);
}

function rotate(rotation) {
  if (Number.isNaN(rotation) || rotation < 0 || rotation > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for rotate(${rotation})`);
  }
  return pattern => new RotateHandler(rotation, pattern);
}

function offset(offset) {
  if (Number.isNaN(offset) || offset < 0 || offset > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for offset(${offset})`);
  }
  return pattern => new OffsetHandler(offset, pattern);
}


export function evaluate(str) {
  return eval(str);
  // try {
  //
  // } catch(error) {
  //   console.log('pattern eval error', error);
  //   throw new Error(error);
  // }
}
