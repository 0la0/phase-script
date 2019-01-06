import BaseHandler from 'services/EventCycle/Pattern/BaseHandler';
import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';
import RepeatHandler, { repeatHandler } from 'services/EventCycle/Pattern/RepeatHandler';
import ReverseHandler, { reverseHandler } from 'services/EventCycle/Pattern/ReverseHandler';
import OffsetHandler, { offsetHandler } from 'services/EventCycle/Pattern/OffsetHandler';
import RotateHandler, { rotateHandler } from 'services/EventCycle/Pattern/RotateHandler';
// import BreakHandler, { repeatHandler } from 'services/EventCycle/Pattern/BreakHandler';
import SpeedHandler, { speedHandler } from 'services/EventCycle/Pattern/SpeedHandler';

function buildHof(transformer) {
  function hof(param) {
    // if (typeof param === 'string') {
    //   return ` ${tag} ${param}`;
    // }
    if (param instanceof PatternHandler) {
      // do transformation / wrapping here
      // return transformer(param);
      return transformer(param);
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        // if (typeof result === 'string') {
        //   return ` ${tag} ${result}`;
        // }
        if (result instanceof PatternHandler) {
          // do transformation / wrapping here
          return transformer(result);
        }
        return hof(result);
      };
    }
    throw new TypeError(`Invalid type: ${param}`);
  }
  return hof;
}

function pattern(str) {
  if (typeof str !== 'string') {
    throw new TypeError(`Illegal Argument: string required for pattern(${str})`);
  }
  return new PatternHandler(str);
}
function p(str) {
  return pattern(str);
}

function reverse() {
  // if (!(pattern instanceof BaseHandler)) {
  //   throw new TypeError(`Illegal Argument: pattern required for reverse(${pattern})`);
  // }
  // return new ReverseHandler(pattern);
  // return pattern => new ReverseHandler(pattern);
  // return pattern => reverseHandler(pattern);
  const transformer = reverseHandler();
  return buildHof(transformer);
}
function rev(pattern) {
  return reverse(pattern);
}

function repeat(num) {
  if (!Number.isInteger(num) || num < 1) {
    throw new TypeError(`Illegal Argument: integer required for repeat(${num})`);
  }
  // return pattern => new RepeatHandler(num, pattern);
  return buildHof(repeatHandler(num));
  // return pattern => repeatHandler(num, pattern);
}
function rep(num) {
  return repeat(num);
}

function speed(speed) {
  if (Number.isNaN(speed)) {
    throw new TypeError(`Illegal Argument: float required for speed(${speed})`);
  }
  // return function(pattern) {
  //   if (pattern) {
  //     return new SpeedHandler(speed, pattern);
  //   }
  //   return pattern => new SpeedHandler(speed, pattern);
  // }
  // return function () {
    // return pattern => new SpeedHandler(speed, pattern);
  // }
  // return () => (new SpeedHandler(speed, pattern))()
  // return pattern => new SpeedHandler(speed, pattern);
  // return pattern => speedHandler(speed, pattern);
  // return speedHandler(speed);

  const transformer = speedHandler(speed);
  return buildHof(transformer);
}

function rotate(rotation) {
  if (Number.isNaN(rotation) || rotation < 0 || rotation > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for rotate(${rotation})`);
  }
  return buildHof(rotateHandler(rotation));
  // return pattern => new RotateHandler(rotation, pattern);
}

function offset(offset) {
  if (Number.isNaN(offset) || offset < 0 || offset > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for offset(${offset})`);
  }
  return buildHof(offsetHandler(offset));
  // return pattern => new OffsetHandler(offset, pattern);
}


export function evaluate(str) {
  console.log('start eval')

  let sequences = [];

  function seq(arg) {
    const sequence = Array.isArray(arg) ? arg : [ arg ];
    sequences.push(sequence);
    // console.log('register', sequence);
  }

  eval(str);
  console.log('eval done', sequences);
  return sequences;
  // try {
  //
  // } catch(error) {
  //   console.log('pattern eval error', error);
  //   throw new Error(error);
  // }
}
