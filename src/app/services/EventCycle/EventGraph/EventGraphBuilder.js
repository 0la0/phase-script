import Chorus from './UnitGenerators/Chorus';
import Dac from './UnitGenerators/Dac';
import Delay from './UnitGenerators/Delay';
import Filter from './UnitGenerators/Filter';
import Gain from './UnitGenerators/Gain';
import MessageAddress from './UnitGenerators/MessageAddress';
import MessageMap from './UnitGenerators/MessageMap';
import MessageFilter from './UnitGenerators/MessageFilter';
import Osc from './UnitGenerators/Osc';
import Panner from './UnitGenerators/Panner';
import Reverb from './UnitGenerators/Reverb';
import Sampler from './UnitGenerators/Sampler';
import Waveshaper from './UnitGenerators/Waveshaper';

const DAC_ID = 'DAC_ID';

const typeMap = {
  CHORUS: Chorus,
  DAC: Dac,
  DELAY: Delay,
  FILTER: Filter,
  GAIN: Gain,
  MSG_ADDRESS: MessageAddress,
  MSG_MAP: MessageMap,
  MSG_FILTER: MessageFilter,
  OSC: Osc,
  PANNER: Panner,
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

function connectNodes(graph) {
  const nodeOutputMap = Object.keys(graph).reduce((acc, key) => {
    graph[key].nodeDefinition.inputs.forEach((inputId) => {
      if (!acc[inputId]) {
        acc[inputId] = new Set([key]);
      } else {
        acc[inputId].add(key);
      }
    });
    return acc;
  }, {});

  Object.keys(nodeOutputMap).forEach(key => {
    const node = graph[key].instance;
    const outputAudioModels = [...nodeOutputMap[key]].map(id => graph[id].instance.getAudioModel());
    node.batchConnect(outputAudioModels);
  });
}

function disconnectOldNodes(oldGraph, currentGraph) {
  Object.values(oldGraph)
    .forEach((node) => {
      // const { id } = node.nodeDefinition;
      const currentGraphHasNode = Object.values(currentGraph)
        .some(_node => _node.nodeDefinition.id === node.nodeDefinition.id);
      if (!currentGraphHasNode) {
        setTimeout(() => node.instance.disconnect());
      }
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
  disconnectOldNodes(currentBuiltGraph, builtNodes);
  connectNodes(builtNodes);
  currentBuiltGraph = builtNodes;
}
