import Bitcrusher from 'services/UnitGenerators/Bitcrusher';
import Chorus from 'services/UnitGenerators/Chorus';
import ContinuousOsc from 'services/UnitGenerators/ContinuousOsc';
import Dac from 'services/UnitGenerators/Dac';
import Delay from 'services/UnitGenerators/Delay';
import EnvelopedOsc from 'services/UnitGenerators/EnvelopedOsc';
import EnvelopedNoise from 'services/UnitGenerators/EnvelopedNoise';
import Filter from 'services/UnitGenerators/Filter';
import Gain from 'services/UnitGenerators/Gain';
import Gate from 'services/UnitGenerators/Gate';
import MessageAddress from 'services/UnitGenerators/MessageAddress';
import MessageDelay from 'services/UnitGenerators/MessageDelay';
import MessageMap from 'services/UnitGenerators/MessageMap';
import MessageMidiCcOut from 'services/UnitGenerators/MessageMidiCcOut';
import MessageMidiIn from 'services/UnitGenerators/MessageMidiIn';
import MessageMidiNoteOut from 'services/UnitGenerators/MessageMidiNoteOut';
import MessageFilter from 'services/UnitGenerators/MessageFilter';
import MessageScaleLock from 'services/UnitGenerators/MessageScaleLock';
import MessageThreshold from 'services/UnitGenerators/MessageThreshold';
import Panner from 'services/UnitGenerators/Panner';
import Reverb from 'services/UnitGenerators/Reverb';
import Sampler from 'services/UnitGenerators/Sampler';
import ThresholdEventProcessor from 'services/UnitGenerators/ThresholdEventProcessor';
import Waveshaper from 'services/UnitGenerators/Waveshaper';
import DynamicParameter from './DynamicParameter';

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
        node.instance.disconnect();
        // setTimeout(() => node.instasnce.disconnect());
      }
    });
}

export default class AudioGraphManager {
  constructor() {
    this.currentBuiltGraph = {};
  }

  buildAudioGraph(graphDefinition = {}, time) {
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

  cancelAllFutureAudioEvents() {
    console.log('TODO: cancelAllFutureAudioEvents'); // eslint-disable-line no-console
  }
}
