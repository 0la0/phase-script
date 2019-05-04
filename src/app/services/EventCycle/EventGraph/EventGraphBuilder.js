import Bitcrusher from './UnitGenerators/Bitcrusher';
import Chorus from './UnitGenerators/Chorus';
import ContinuousOsc from './UnitGenerators/ContinuousOsc';
import Dac from './UnitGenerators/Dac';
import Delay from './UnitGenerators/Delay';
import EnvelopedOsc from './UnitGenerators/EnvelopedOsc';
import EnvelopedNoise from './UnitGenerators/EnvelopedNoise';
import Filter from './UnitGenerators/Filter';
import Gain from './UnitGenerators/Gain';
import Gate from './UnitGenerators/Gate';
import MessageAddress from './UnitGenerators/MessageAddress';
import MessageDelay from './UnitGenerators/MessageDelay';
import MessageMap from './UnitGenerators/MessageMap';
import MessageMidiCcOut from './UnitGenerators/MessageMidiCcOut';
import MessageMidiIn from './UnitGenerators/MessageMidiIn';
import MessageMidiNoteOut from './UnitGenerators/MessageMidiNoteOut';
import MessageFilter from './UnitGenerators/MessageFilter';
import MessageScaleLock from './UnitGenerators/MessageScaleLock';
import MessageThreshold from './UnitGenerators/MessageThreshold';
import Panner from './UnitGenerators/Panner';
import Reverb from './UnitGenerators/Reverb';
import Sampler from './UnitGenerators/Sampler';
import ThresholdEventProcessor from './UnitGenerators/ThresholdEventProcessor';
import Waveshaper from './UnitGenerators/Waveshaper';
import DynamicParameter from './EventGraphFunctions/DynamicParameter';

// TODO: rename file to `AudioStateBuilder`, `AudioStateManager`, or `UnitGeneratorFactory`
// TODO: use types from EventGraphApiDefinition.js
const typeMap = {
  BITCRUSHER: Bitcrusher,
  CHORUS: Chorus,
  CONTINUOUS_OSC: ContinuousOsc,
  DAC: Dac,
  DELAY: Delay,
  ENVELOPED_OSC: EnvelopedOsc,
  ENVELOPED_NOISE: EnvelopedNoise,
  FILTER: Filter,
  GAIN: Gain,
  GATE: Gate,
  MSG_ADDRESS: MessageAddress,
  MSG_DELAY: MessageDelay,
  MSG_FILTER: MessageFilter,
  MSG_MAP: MessageMap,
  MSG_MIDI_CC_OUT: MessageMidiCcOut,
  MSG_MIDI_IN: MessageMidiIn,
  MSG_MIDI_NOTE_OUT: MessageMidiNoteOut,
  MSG_SCALE_LOCK: MessageScaleLock,
  MSG_THRESH: MessageThreshold,
  PANNER: Panner,
  REVERB: Reverb,
  SAMPLER: Sampler,
  THRESH_EVENT: ThresholdEventProcessor,
  WAVESHAPER: Waveshaper,
};

const outputTypes = [ 'DAC', 'MSG_MIDI_NOTE_OUT', 'MSG_MIDI_CC_OUT', 'MSG_MIDI_IN' ];
function graphHasSink(graphDefinition) {
  return Object.values(graphDefinition).some(ele => outputTypes.includes(ele.type));
}

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

function connectNodeParams(graph, time) {
  Object.keys(graph).forEach(key => {
    const { nodeDefinition, instance, } = graph[key];
    const params = Object.keys(nodeDefinition.params)
      .filter(paramKey => nodeDefinition.params[paramKey] instanceof DynamicParameter)
      .map(paramKey => nodeDefinition.params[paramKey]);
    if (!params.length) {
      return;
    }
    const paramMap = params.reduce((acc, param) => {
      const targetNode = graph[param.getNodeId()];
      const targetAudioModel = targetNode.instance.getAudioModel();
      return Object.assign(acc, { [param.getParamName()]: targetAudioModel });
    }, {});
    instance.updateParams(paramMap, time);
  });
}

function disconnectOldNodes(oldGraph, currentGraph) {
  Object.values(oldGraph)
    .forEach((node) => {
      const currentGraphHasNode = Object.values(currentGraph)
        .some(_node => _node.nodeDefinition.id === node.nodeDefinition.id);
      if (!currentGraphHasNode) {
        setTimeout(() => node.instance.disconnect());
      }
    });
}

export default class EventGraphBuilder {
  constructor() {
    this.currentBuiltGraph = {};
  }

  buildEventGraph(graphDefinition = {}, time) {
    if (!graphHasSink(graphDefinition)) {
      throw new Error('graphDefinition missing sink (dac, or midiOut)');
    }
    const builtNodes = Object.keys(graphDefinition)
      .reduce((acc, key) => {
        const nodeDefinition = graphDefinition[key];
        if (this.currentBuiltGraph && this.currentBuiltGraph[nodeDefinition.id]) {
          const instance = this.currentBuiltGraph[nodeDefinition.id].instance;
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
    disconnectOldNodes(this.currentBuiltGraph, builtNodes);
    connectNodes(builtNodes);
    connectNodeParams(builtNodes, time);
    this.currentBuiltGraph = builtNodes;
  }
}
