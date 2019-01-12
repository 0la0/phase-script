import PatternHandler from 'services/EventCycle/Pattern/PatternHandler';
import { repeatHandler } from 'services/EventCycle/PatternFunctions/RepeatHandler';
import { reverseHandler } from 'services/EventCycle/PatternFunctions/ReverseHandler';
import { offsetHandler } from 'services/EventCycle/PatternFunctions/OffsetHandler';
import { rotateHandler } from 'services/EventCycle/PatternFunctions/RotateHandler';
import { speedHandler } from 'services/EventCycle/PatternFunctions/SpeedHandler';
import { everyHandler } from 'services/EventCycle/PatternFunctions/EveryHandler';
import { degradeHandler } from 'services/EventCycle/PatternFunctions/DegradeHandler';

function buildHof(transformer) {
  function hof(param) {
    if (param instanceof PatternHandler) {
      return transformer(param);
    }
    if (typeof param === 'function') {
      return arg => {
        const result = param(arg);
        if (result instanceof PatternHandler) {
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

function reverse() {
  return buildHof(reverseHandler());
}

function repeat(num) {
  if (!Number.isInteger(num) || num < 1) {
    throw new TypeError(`Illegal Argument: integer required for repeat(${num})`);
  }
  return buildHof(repeatHandler(num));
}

function speed(speed) {
  if (Number.isNaN(speed)) {
    throw new TypeError(`Illegal Argument: float required for speed(${speed})`);
  }
  return buildHof(speedHandler(speed));
}

function rotate(rotation) {
  if (Number.isNaN(rotation) || rotation < 0 || rotation > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for rotate(${rotation})`);
  }
  return buildHof(rotateHandler(rotation));
}

function offset(offset) {
  if (Number.isNaN(offset) || offset < 0 || offset > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for offset(${offset})`);
  }
  return buildHof(offsetHandler(offset));
}

function every(iteration, transform) {
  return buildHof(everyHandler(iteration, transform));
}

function degrade(threshold) {
  if (Number.isNaN(threshold) || threshold < 0 || threshold > 1) {
    throw new TypeError(`Illegal Argument: float [0, 1] required for degrade(${offset})`);
  }
  return buildHof(degradeHandler(threshold));
}

export function evaluate(str) {
  let sequences = [];

  function seq(arg) {
    const sequence = Array.isArray(arg) ? arg : [ arg ];
    sequences.push(sequence);
    console.log('sequences', sequences)
  }

  eval(str);
  return sequences;
}
