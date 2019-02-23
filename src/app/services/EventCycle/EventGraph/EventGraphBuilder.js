import Address from './UnitGenerators/Address';
import Chorus from './UnitGenerators/Chorus';
import Dac from './UnitGenerators/Dac';
import Delay from './UnitGenerators/Delay';
import Filter from './UnitGenerators/Filter';
import Gain from './UnitGenerators/Gain';
import Osc from './UnitGenerators/Osc';
import Reverb from './UnitGenerators/Reverb';
import Sampler from './UnitGenerators/Sampler';
import Waveshaper from './UnitGenerators/Waveshaper';

const DAC_ID = 'DAC_ID';

const typeMap = {
  ADDRESS: Address,
  CHORUS: Chorus,
  DAC: Dac,
  DELAY: Delay,
  FILTER: Filter,
  GAIN: Gain,
  OSC: Osc,
  REVERB: Reverb,
  SAMPLER: Sampler,
  WAVESHAPER: Waveshaper,
};

let currentBuiltGraph = {};

function buildNodeType(node) {
  const instance = typeMap[node.type];
  if (!instance) {
    throw new Error(`Audio graph definition not found for ${node.type}`);
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

export function buildEventGraph(graphDefinition = {}, time) {
  if (!graphDefinition[DAC_ID]) {
    throw new Error(`graphDefinition missing end node ${graphDefinition}`);
  }
  const builtNodes = Object.keys(graphDefinition)
    .reduce((acc, key) => {
      const nodeDefinition = graphDefinition[key];
      if (currentBuiltGraph && currentBuiltGraph[nodeDefinition.id]) {
        const instance = currentBuiltGraph[nodeDefinition.id].instance;
        instance.updateParams(nodeDefinition.params, time);
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
