import Address from './UnitGenerators/Address';
import Dac from './UnitGenerators/Dac';
import Gain from './UnitGenerators/Gain';
import Osc from './UnitGenerators/Osc';

const DAC_ID = 'DAC_ID';

const typeMap = {
  DAC: Dac,
  GAIN: Gain,
  ADDRESS: Address,
  OSC: Osc,
};

let currentBuiltGraph = {};

function buildNodeType(node) {
  const instance = typeMap[node.type];
  if (!typeMap[node.type]) {
    console.log('Audio graph definition not found for', node.type);
    return `TODO: ${node.type}`;
  }
  return instance;
}

function connectToInputs(node, graph) {
  if (!node) {
    return;
  }
  node.nodeDefinition.inputs.forEach(inputId => {
    const input = graph[inputId].instance;
    const output = node.instance;
    input.audioModel.connectTo(output.audioModel);
    connectToInputs(graph[inputId], graph);
  });
}

export function buildEventGraph(graphDefinition = {}) {
  if (!graphDefinition[DAC_ID]) {
    console.log('graphDefinition missing end node', graphDefinition);
    return;
  }
  const builtNodes = Object.keys(graphDefinition)
    .reduce((acc, key) => {
      const nodeDefinition = graphDefinition[key];
      if (currentBuiltGraph && currentBuiltGraph[nodeDefinition.id]) {
        const instance = currentBuiltGraph[nodeDefinition.id].instance;
        instance.updateParams(nodeDefinition.params);
        return Object.assign(acc, {
          [key]: { nodeDefinition, instance, },
        });
      }
      const NodeClazz = buildNodeType(nodeDefinition);
      const instance = NodeClazz.fromParams(nodeDefinition.params);
      return Object.assign(acc, {
        [key]: { nodeDefinition, instance, },
      });
    }, {});
  connectToInputs(builtNodes[DAC_ID], builtNodes);
  currentBuiltGraph = builtNodes;
}
