import { pattern } from 'services/EventCycle/Pattern/PatternHandler';
import repeat from 'services/EventCycle/PatternFunctions/RepeatHandler';
import reverse from 'services/EventCycle/PatternFunctions/ReverseHandler';
import offset from 'services/EventCycle/PatternFunctions/OffsetHandler';
import rotate from 'services/EventCycle/PatternFunctions/RotateHandler';
import speed from 'services/EventCycle/PatternFunctions/SpeedHandler';
import every from 'services/EventCycle/PatternFunctions/EveryHandler';
import degrade from 'services/EventCycle/PatternFunctions/DegradeHandler';

const exposedApi = [ repeat, reverse, offset, rotate, speed, every, degrade, pattern ];
const apiNamespace = exposedApi.map(fn => fn.name).join(', ');

function evaluateUserInput(str) {
  return Function(`
    'use strict';
    return (${apiNamespace}) => {
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

      ${str}

      return { sequences, addressInlets };
    };
  `)()(...exposedApi);
}

export function evaluate(str) {
  // const sequences = [];
  // const addressInlets = [];
  //
  // function seq(arg) {
  //   const sequence = Array.isArray(arg) ? arg : [ arg ];
  //   sequences.push(sequence);
  //   console.log('sequences', sequences)
  // }
  //
  // function addr(a) {
  //   addressInlets.push(a);
  //   console.log('address', a);
  // }

  return evaluateUserInput(str);
  // return testResult;

  // eval(str);
  // return { sequences, addressInlets };
}
