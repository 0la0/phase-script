import { uuid } from 'services/Math';
import { eventGraphApi } from 'services/EventCycle/EventGraph/ExposedApi';
import { patternApi } from 'services/EventCycle/PatternFunctions';

const exposedApi = [].concat(patternApi, eventGraphApi, [ uuid ]);
const apiNamespace = exposedApi.map(fn => fn.name).join(', ');

export function evaluateUserInput(str) {
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
        const id = uuid();
        return eventNodeWrapper((graph) => {
          const address = new EventGraphNode('ADDRESS', id).setParams({ address: a });
          graph.addNode(address);
          addressInlets.push(graph);
          return graph;
        });
      }

      ${str}

      return { sequences, addressInlets };
    };
  `)()(...exposedApi);
}
