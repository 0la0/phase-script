import { eventGraphApi } from 'services/EventCycle/EventGraph/EventGraphFunctions/ExposedApi';
import { patternApi } from 'services/EventCycle/PatternFunctions/ExposedApi';
import { utilApi } from 'services/EventCycle/Util';

const eventGraphFunctions = eventGraphApi.map(ele => ele.fn);
const exposedApi = [].concat(patternApi, eventGraphFunctions, utilApi);
const apiNamespace = exposedApi.map(fn => fn.name).join(', ');

const exposedEventGraph = eventGraphApi.map(({ name, fn, }) => {
  return `
    function ${name}() {
      const graph = ${fn.name}.apply(undefined, arguments);
      audioGraphInlets.push(graph);
      return graph;
    }
  `;
}).join('');

export function evaluateUserInput(userInputString) {
  return Function(`
    'use strict';
    return (${apiNamespace}) => {
      const sequences = [];
      const audioGraphInlets = [];
      const seq = (arg) => sequences.push(Array.isArray(arg) ? arg : [ arg ]);
      ${exposedEventGraph}
      ${userInputString}
      return { sequences, audioGraphInlets };
    };
  `)()(...exposedApi);
}
