import { eventGraphApi } from 'services/EventCycle/EventGraph/EventGraphFunctions/ExposedApi';
import { patternApi } from 'services/EventCycle/PatternFunctions/ExposedApi';

const exposedApi = [].concat(patternApi, eventGraphApi);
const apiNamespace = exposedApi.map(fn => fn.name).join(', ');

export function evaluateUserInput(str) {
  return Function(`
    'use strict';
    return (${apiNamespace}) => {
      const sequences = [];
      const addressInlets = [];
      const addGraphCallback = graph => addressInlets.push(graph);
      const seq = (arg) => sequences.push(Array.isArray(arg) ? arg : [ arg ]);
      const addr = a => {
        const graph = _address(a);
        addressInlets.push(graph);
        return graph;
      };
      ${str}
      return { sequences, addressInlets };
    };
  `)()(...exposedApi);
}
