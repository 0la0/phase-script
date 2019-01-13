import { patternFn } from 'services/EventCycle/Pattern/PatternHandler';
import repeatFn from 'services/EventCycle/PatternFunctions/RepeatHandler';
import reverseFn from 'services/EventCycle/PatternFunctions/ReverseHandler';
import offsetFn from 'services/EventCycle/PatternFunctions/OffsetHandler';
import rotateFn from 'services/EventCycle/PatternFunctions/RotateHandler';
import speedFn from 'services/EventCycle/PatternFunctions/SpeedHandler';
import everyFn from 'services/EventCycle/PatternFunctions/EveryHandler';
import degradeFn from 'services/EventCycle/PatternFunctions/DegradeHandler';

// necessary because of webpack namespacing
const repeat = repeatFn;
const reverse = reverseFn;
const offset = offsetFn;
const rotate = rotateFn;
const speed = speedFn;
const every = everyFn;
const degrade = degradeFn;
const pattern = patternFn;

export function evaluate(str) {
  const sequences = [];
  const addressInlets = [];

  function seq(arg) {
    const sequence = Array.isArray(arg) ? arg : [ arg ];
    sequences.push(sequence);
    console.log('sequences', sequences)
  }

  function addr(a) {
    addressInlets.push(a);
    console.log('address', a);
  }

  eval(str);
  return { sequences, addressInlets };
}
