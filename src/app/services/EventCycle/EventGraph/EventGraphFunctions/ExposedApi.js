import { EventGraphNode } from './EventGraphNode';
import EventGraph from './EventGraph';

// TODO:
//   * parameter validation
//   * message duplicator
//   * rand parameters for msgDelay
//   * message repeater
//   * midi out
//   * continuous osc
//   * modulator connections
//   * mic in
//   * compressor node
//   * wet levels on audio effect nodes
//   * arpeggiators
//   * address as graph parameters
//   * anonymous patterns
//   * key shortcut to generate node IDs
//   * sample bank
//   * midi config editor

export class DynamicParameter {
  constructor(nodeId) {
    this.nodeId = nodeId;
  }

  getNodeId() {
    return this.nodeId;
  }
}

function _setCurrent(node) {
  if (this instanceof EventGraphBuilder) {
    return this._setCurrent(node);
  }
  return new EventGraphBuilder()._setCurrent(node);
}

function _address(address) {
  const addressNode = new EventGraphNode({
    type: 'MSG_ADDRESS',
    params: { address }
  });
  return _setCurrent.call(this, addressNode);
}

function _dac() {
  const dacNode = new EventGraphNode({ type: 'DAC', id: 'DAC_ID' });
  return _setCurrent.call(this, dacNode);
}

function buildNodeEvaluator(nameParamPair) {
  const { name, paramDefinitions, } = nameParamPair;
  function nodeBuilder(...args) {
    let id;
    let tag = '';
    const params = args.reduce((acc, arg, index) => {
      const definition = paramDefinitions[index];
      if (definition.paramName === 'ID') {
        id = arg;
        return acc;
      }
      let paramValue;
      if (arg instanceof EventGraphBuilder) {
        const outputNode = arg.currentNode;
        paramValue = new DynamicParameter(outputNode.id);
      } else {
        paramValue = arg;
      }
      acc[definition.paramName] = paramValue;
      return acc;
    }, {});
    const eventGraphNode = new EventGraphNode({
      type: name,
      id: id ? `${name}-${id}` : undefined,
      params
    });
    return _setCurrent.call(this, eventGraphNode);
  }
  return { name, nodeBuilder, };
}

const gainNode = {
  name: 'GAIN',
  paramDefinitions: [
    {
      paramName: 'gainValue',
      type: 'float',
    },
    {
      paramName: 'ID', // USE CONSTANT
      taggable: true,
    }
  ],
};

const panNode = {
  name: 'PANNER',
  paramDefinitions: [
    {
      paramName: 'panValue',
      type: 'float',
    },
    {
      paramName: 'ID', // USE CONSTANT
      taggable: true,
    }
  ],
};

const testGainNode = buildNodeEvaluator(gainNode);
const testPanNode = buildNodeEvaluator(panNode);

// function _gain(gainValue, id) {
//   if (gainValue instanceof EventGraphBuilder) {
//     // TODO: create addapter to go from address node to param ...
//     const outputNode = gainValue.currentNode;
//     // console.log('gainValue', outputNode.id);
//     // gainValue.addaptMessageToParam();
//     // gainValue = 0.5;
//     gainValue = new DynamicParameter(outputNode.id);
//   }
//   const gainNode = new EventGraphNode({
//     type: 'GAIN',
//     id: id ? `GAIN-${id}` : undefined,
//     params: { gainValue },
//     isModulatable: true
//   });
//   return _setCurrent.call(this, gainNode);
// }

function _gain(...args) {
  return testGainNode.nodeBuilder.apply(this, args);
}

function _pan(...args) {
  return testPanNode.nodeBuilder.apply(this, args);
}

function buildContinuousOsc(frequency, id, oscType) {
  const params = { frequency, oscType, };
  const oscNode = new EventGraphNode({
    type: 'CONTINUOUS_OSC',
    id: id ? `OSC-${oscType}-${id}` : undefined,
    params,
    isModulatable: true
  });
  return _setCurrent.call(this, oscNode);
}

// attack, sustain, release, type
// attack, sustain, release, type, id
// frequency, type
// frequency, type, id
function buildOsc(...args) {
  if (args.length > 3) {
    return buildEnvelopedOsc.apply(this, args);
  }
  return buildContinuousOsc.apply(this, args);
}

function buildEnvelopedOsc(attack, sustain, release, id, oscType) {
  const params = { attack, sustain, release, oscType, };
  const oscNode = new EventGraphNode({
    type: 'ENVELOPED_OSC',
    id: id ? `OSC-${oscType}-${id}` : undefined,
    params,
    isModulatable: true
  });
  return _setCurrent.call(this, oscNode);
}

function _reverb(attack, decay, wet, id) {
  const params = { attack, decay, wet, };
  const oscNode = new EventGraphNode({
    type: 'REVERB',
    id: id ? `REVERB-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, oscNode);
}

function _chorus(frequency, depth, feedback, id) {
  const params = { frequency, depth, feedback, };
  const oscNode = new EventGraphNode({
    type: 'CHORUS',
    id: id ? `CHORUS-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, oscNode);
}

function _delay(delayMs, feedback, wet, id) {
  const params = { delayMs, feedback, wet, };
  const oscNode = new EventGraphNode({
    type: 'DELAY',
    id: id ? `DELAY-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, oscNode);
}

function _biquadFilter(type, frequency, q, id) {
  const params = { type, frequency, q, };
  const filterNode = new EventGraphNode({
    type: 'FILTER',
    id: id ? `FILTER-${type}-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, filterNode);
}

function _lp(frequency, q, id) {
  return _biquadFilter.call(this, 'lowpass', frequency, q, id);
}

function _hp(frequency, q, id) {
  return _biquadFilter.call(this, 'highpass', frequency, q, id);
}

function _bp(frequency, q, id) {
  return _biquadFilter.call(this, 'bandpass', frequency, q, id);
}

function _sin(...args) {
  return buildOsc.apply(this, args.concat('sin'));
}

function _squ(...args) {
  return buildOsc.apply(this, args.concat('squ'));
}

function _saw(...args) {
  return buildOsc.apply(this, args.concat('saw'));
}

function _tri(...args) {
  return buildOsc.apply(this, args.concat('tri'));
}

function buildWvshp(type, wet, id) {
  const params = { type, wet, id, };
  const filterNode = new EventGraphNode({
    type: 'WAVESHAPER',
    id: id ? `WAVESHAPER-${type}-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, filterNode);
}

const wvshp = {
  squ: function (wet, id) { return buildWvshp.call(this, 'square', wet, id); },
  cube: function (wet, id) { return buildWvshp.call(this, 'cubed', wet, id); },
  cheb: function (wet, id) { return buildWvshp.call(this, 'chebyshev2', wet, id); },
  sig: function (wet, id) { return buildWvshp.call(this, 'sigmoidLike', wet, id); },
  clip: function (wet, id) { return buildWvshp.call(this, 'hardClip', wet, id); },
};

function _samp(sampleName, attack, sustain, release, id) {
  const params = { sampleName, attack, sustain, release, };
  const samplerNode = new EventGraphNode({
    type: 'SAMPLER',
    id: id ? `SAMPLER-${sampleName}-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, samplerNode);
}

function _map(mapFn) {
  const params = { mapFn, };
  const messageMapNode = new EventGraphNode({
    type: 'MSG_MAP',
    params,
  });
  return _setCurrent.call(this, messageMapNode);
}

function _filter(filterFn) {
  const params = { filterFn, };
  const messageFilterNode = new EventGraphNode({
    type: 'MSG_FILTER',
    params,
  });
  return _setCurrent.call(this, messageFilterNode);
}

function _messageDelay(delayTime) {
  const params = { delayTime, };
  const messageFilterNode = new EventGraphNode({
    type: 'MSG_DELAY',
    params,
  });
  return _setCurrent.call(this, messageFilterNode);
}

function _messageThreshold(threshold, id) {
  const params = { threshold, };
  const messageFilterNode = new EventGraphNode({
    type: 'MSG_THRESH',
    id: id ? `MSG_THRESH-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, messageFilterNode);
}

function _bitcrusher(bitDepth, freqReduction, wet, id) {
  const params = { bitDepth, freqReduction, wet, };
  const messageFilterNode = new EventGraphNode({
    type: 'BITCRUSHER',
    id: id ? `BITCRUSHER-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, messageFilterNode);
}

function _noise(attack, sustain, release) {
  const params = { attack, sustain, release, };
  const oscNode = new EventGraphNode({
    type: 'ENVELOPED_NOISE',
    params,
  });
  return _setCurrent.call(this, oscNode);
}

function _gate(threshold, id) {
  const params = { threshold };
  const oscNode = new EventGraphNode({
    type: 'GATE',
    id: id ? `GATE-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, oscNode);
}

function _thresholdEventProcessor(threshold, address, id) {
  const params = { threshold, address };
  const oscNode = new EventGraphNode({
    type: 'THRESH_EVENT',
    id: id ? `THRESH_EVENT-${id}` : undefined,
    params,
  });
  return _setCurrent.call(this, oscNode);
}

function _toScale(scaleName) {
  const params = { scaleName };
  const scaleLockNode = new EventGraphNode({
    type: 'MSG_SCALE_LOCK',
    params,
  });
  return _setCurrent.call(this, scaleLockNode);
}

class EventGraphBuilder {
  constructor() {
    this.eventGraph = new EventGraph();
    this.currentNode;

    this.address = _address.bind(this);
    this.dac = _dac.bind(this);
    this.gain = _gain.bind(this);
    this.sin = _sin.bind(this),
    this.squ = _squ.bind(this),
    this.saw = _saw.bind(this),
    this.tri = _tri.bind(this),
    this.reverb = _reverb.bind(this);
    this.chorus = _chorus.bind(this);
    this.delay = _delay.bind(this);
    this.lp = _lp.bind(this);
    this.hp = _hp.bind(this);
    this.bp = _bp.bind(this);
    this.wvshp = {
      squ: wvshp.squ.bind(this),
      cube: wvshp.cube.bind(this),
      cheb: wvshp.cheb.bind(this),
      sig: wvshp.sig.bind(this),
      clip: wvshp.clip.bind(this),
    };
    this.samp = _samp.bind(this);
    this.map = _map.bind(this);
    this.filter = _filter.bind(this);
    this.pan = _pan.bind(this);
    this.msgDelay = _messageDelay.bind(this);
    this.msgThresh = _messageThreshold.bind(this);
    this.crush = _bitcrusher.bind(this);
    this.noise = _noise.bind(this);
    this.gate = _gate.bind(this);
    this.threshEvent = _thresholdEventProcessor.bind(this);
    this.toScale = _toScale.bind(this);
  }

  // TODO: reverse connection strucure: currentNode.addOutput
  _setCurrent(node) {
    if (this.currentNode) {
      if (Array.isArray(this.currentNode)) {
        this.currentNode.forEach(currentNode => node.addInput(currentNode.id));
      } else {
        node.addInput(this.currentNode.id);
      }
    }
    this.currentNode = node;
    this.eventGraph.addNode(node, this.currentNode);
    return this;
  }

  getEventGraph() {
    return this.eventGraph;
  }

  to(...graphBuilders) {
    if (!graphBuilders.length) {
      throw new Error('.to() requires at least one argument');
    }
    if (!graphBuilders.every(ele => ele instanceof EventGraphBuilder)) {
      throw new Error('.to() requires every argument to be an event graph node');
    }
    const subGraphOutputs = graphBuilders.map(graphBuilder => {
      const subGraphInput = graphBuilder.getEventGraph().getInputNode();
      const subGraphOutput = graphBuilder.getEventGraph().getOutputNode();
      // CONNECT CURRENT NODE TO subGraphInput
      Array.isArray(this.currentNode) ?
        this.currentNode.forEach(currentNode => subGraphInput.addInput(currentNode.id)) :
        subGraphInput.addInput(this.currentNode.id);
      // ADD ALL NODES TO THIS GRAPH
      this.eventGraph.addEventGraph(graphBuilder.getEventGraph());
      return subGraphOutput;
    });
    // set subGraphOutputs as the current node
    this.currentNode = subGraphOutputs;
    return this;
  }

  mod(...graphBuilders) {
    if (!graphBuilders.length) {
      throw new Error('.mod() requires at least one argument');
    }
    if (!graphBuilders.every(ele => ele instanceof EventGraphBuilder)) {
      throw new Error('.mod() requires every argument to be an event graph node');
    }
    const subGraphOutputs = graphBuilders
      .map(graphBuilder => graphBuilder.getEventGraph().getOutputNode());
    const currentNodes = Array.isArray(this.currentNode) ? this.currentNode : [ this.currentNode, ];
    currentNodes.forEach((currentNode) => {
      if (currentNode.modulate) {
        currentNode.modulate(subGraphOutputs);
      } else {
        console.log(`modulate definition not found for ${currentNode.type}`)
      }
    });
    return this;
  }

  // TODO
  addaptMessageToParam() {
    return this;
  }
}

export const eventGraphApi = [
  { name: 'addr', fn: _address },
  { name: 'crush', fn: _bitcrusher },
  { name: 'chorus', fn: _chorus },
  { name: 'dac', fn: _dac },
  { name: 'delay', fn: _delay },
  { name: 'filter', fn: _filter },
  { name: 'gain', fn: _gain },
  { name: 'map', fn: _map },
  { name: 'msgDelay', fn: _messageDelay },
  { name: 'msgThresh', fn: _messageThreshold },
  { name: 'pan', fn: _pan },
  { name: 'samp', fn: _samp },
  { name: 'saw', fn: _saw },
  { name: 'sin', fn: _sin },
  { name: 'squ', fn: _squ },
  { name: 'tri', fn: _tri },
];
