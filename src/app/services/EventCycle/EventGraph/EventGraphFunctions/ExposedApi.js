import { EventGraphNode } from './EventGraphNode';
import EventGraph from './EventGraph';

const PARAM_TYPES = {
  FLOAT: 'float',
  FUNCTION: 'function',
  STRING: 'string',
};
const CONSTANTS = {
  ID: 'ID',
};

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

function buildNodeEvaluator(dto) {
  const { name, paramDefinitions = [], constantDefinitions = [], isModulatable } = dto;
  // const { name, paramDefinitions, } = nameParamPair;
  function nodeBuilder(...args) {
    // let id;
    let tag = '';
    const variableParams = paramDefinitions.reduce((acc, definition, index) => {
      // const definition = paramDefinitions[index];
      const arg = args[index];
      if (definition.paramName === CONSTANTS.ID) {
        // id = definition.value || arg;
        tag += (definition.value || arg);
        // id = arg;
        return acc;
      }
      let paramValue;
      if (arg instanceof EventGraphBuilder) {
        const outputNode = arg.currentNode;
        paramValue = new DynamicParameter(outputNode.id);
      } else {
        paramValue = arg;
        if (definition.isTaggable) {
          tag += arg;
        }
      }
      acc[definition.paramName] = paramValue;
      return acc;
    }, {});
    const constantParams = constantDefinitions.reduce((acc, definition) => {
      if (definition.isTaggable) {
        tag += definition.value;
      }
      if (definition.paramName === CONSTANTS.ID) {
        return acc;
      }
      acc[definition.paramName] = definition.value;
      return acc;
    }, {});
    const eventGraphNode = new EventGraphNode({
      type: name,
      id: tag ? `${name}-${tag}` : undefined,
      params: Object.assign({}, variableParams, constantParams),
      isModulatable: !!isModulatable,
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
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const panNode = {
  name: 'PANNER',
  paramDefinitions: [
    {
      paramName: 'panValue',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const dacNode = {
  name: 'DAC',
  constantDefinitions: [
    {
      paramName: CONSTANTS.ID,
      value: CONSTANTS.ID,
      isTaggable: true,
    }
  ],
};

const addressNode = {
  name: 'MSG_ADDRESS',
  paramDefinitions: [
    {
      paramName: 'address',
      type: PARAM_TYPES.STRING,
    }
  ]
};

const reverbNode = {
  name: 'REVERB',
  paramDefinitions: [
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'decay',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'wet',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const chorusNode = {
  name: 'CHORUS',
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'depth',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'feedback',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const delayNode = {
  name: 'DELAY',
  paramDefinitions: [
    {
      paramName: 'delayMs',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'feedback',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'wet',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const lowpassNode = {
  name: 'FILTER',
  constantDefinitions: [
    {
      paramName: 'type',
      value: 'lowpass',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'q',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const highpassNode = {
  name: 'FILTER',
  constantDefinitions: [
    {
      paramName: 'type',
      value: 'highpass',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'q',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const bandpassNode = {
  name: 'FILTER',
  constantDefinitions: [
    {
      paramName: 'type',
      value: 'bandpass',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'q',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const waveshaperNode = {
  name: 'WAVESHAPER',
  paramDefinitions: [
    {
      paramName: 'type',
      type: PARAM_TYPES.STRING,
      isTaggable: true,
    },
    {
      paramName: 'wet',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const samplerNode = {
  name: 'SAMPLER',
  paramDefinitions: [
    {
      paramName: 'sampleName',
      type: PARAM_TYPES.STRING,
      isTaggable: true,
    },
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'sustain',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'release',
      type: PARAM_TYPES.FLOAT,
    }
  ]
};

const messageMapNode = {
  name: 'MSG_MAP',
  paramDefinitions: [
    {
      paramName: 'mapFn',
      type: PARAM_TYPES.FUNCTION,
    }
  ]
};

const messageFilterNode = {
  name: 'MSG_FILTER',
  paramDefinitions: [
    {
      paramName: 'filterFn',
      type: PARAM_TYPES.FUNCTION,
    }
  ]
};

const messageDelayNode = {
  name: 'MSG_DELAY',
  paramDefinitions: [
    {
      paramName: 'delayTime',
      type: PARAM_TYPES.FLOAT,
    }
  ]
};

const messageThresholdNode = {
  name: 'MSG_THRESH',
  paramDefinitions: [
    {
      paramName: 'threshold',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const messageScaleLockNode = {
  name: 'MSG_SCALE_LOCK',
  paramDefinitions: [
    {
      paramName: 'scaleName',
      type: PARAM_TYPES.STRING,
    }
  ]
};

const envelopedNoiseNode = {
  name: 'ENVELOPED_NOISE',
  paramDefinitions: [
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'sustain',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'release',
      type: PARAM_TYPES.FLOAT,
    }
  ]
};

const bitcrusherNode = {
  name: 'BITCRUSHER',
  paramDefinitions: [
    {
      paramName: 'bitDepth',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'freqReduction',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'wet',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const gateNode = {
  name: 'GATE',
  paramDefinitions: [
    {
      paramName: 'threshold',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const thresholdEventNode = {
  name: 'THRESH_EVENT',
  paramDefinitions: [
    {
      paramName: 'threshold',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'address',
      type: PARAM_TYPES.STRING,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const envelopedSinNode = {
  name: 'ENVELOPED_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'sin',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'sustain',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'release',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    },
  ],
};

const envelopedSquNode = {
  name: 'ENVELOPED_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'squ',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'sustain',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'release',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    },
  ],
};

const envelopedSawNode = {
  name: 'ENVELOPED_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'saw',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'sustain',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'release',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    },
  ],
};

const envelopedTriNode = {
  name: 'ENVELOPED_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'tri',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'attack',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'sustain',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: 'release',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    },
  ],
};

const continuousSinNode = {
  name: 'CONTINUOUS_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'sin',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const continuousSquNode = {
  name: 'CONTINUOUS_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'squ',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const continuousSawNode = {
  name: 'CONTINUOUS_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'saw',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const continuousTriNode = {
  name: 'CONTINUOUS_OSC',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'tri',
      isTaggable: true,
    }
  ],
  paramDefinitions: [
    {
      paramName: 'frequency',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
      isStatic: true,
    }
  ]
};

const testGainNode = buildNodeEvaluator(gainNode);
const testPanNode = buildNodeEvaluator(panNode);
const testDacNode = buildNodeEvaluator(dacNode);
const testAddressNode = buildNodeEvaluator(addressNode);
const testReverbNode = buildNodeEvaluator(reverbNode);
const testChorusNode = buildNodeEvaluator(chorusNode);
const testDelayNode = buildNodeEvaluator(delayNode);
const testLowpassNode = buildNodeEvaluator(lowpassNode);
const testHighpassNode = buildNodeEvaluator(highpassNode);
const testBandpassNode = buildNodeEvaluator(bandpassNode);
const testWaveshaperNode = buildNodeEvaluator(waveshaperNode);
const testSamplerNode = buildNodeEvaluator(samplerNode);
const testMessageMapNode = buildNodeEvaluator(messageMapNode);
const testMessageFilterNode = buildNodeEvaluator(messageFilterNode);
const testMessageDelayNode = buildNodeEvaluator(messageDelayNode);
const testMessageThresholdNode = buildNodeEvaluator(messageThresholdNode);
const testMessageScaleLockNode = buildNodeEvaluator(messageScaleLockNode);
const testEnvelopedNoiseNode = buildNodeEvaluator(envelopedNoiseNode);
const testBitcrusherNode = buildNodeEvaluator(bitcrusherNode);
const testGateNode = buildNodeEvaluator(gateNode);
const testThresholdEventNode = buildNodeEvaluator(thresholdEventNode);
const testEnvelopedSinNode = buildNodeEvaluator(envelopedSinNode);
const testEnvelopedSquNode = buildNodeEvaluator(envelopedSquNode);
const testEnvelopedSawNode = buildNodeEvaluator(envelopedSawNode);
const testEnvelopedTriNode = buildNodeEvaluator(envelopedTriNode);
const testContinuousSinNode = buildNodeEvaluator(continuousSinNode);
const testContinuousSquNode = buildNodeEvaluator(continuousSquNode);
const testContinuousSawNode = buildNodeEvaluator(continuousSawNode);
const testContinuousTriNode = buildNodeEvaluator(continuousTriNode);

function _gain(...args) {
  return testGainNode.nodeBuilder.apply(this, args);
}

function _pan(...args) {
  return testPanNode.nodeBuilder.apply(this, args);
}

function _dac(...args) {
  return testDacNode.nodeBuilder.apply(this, args);
}

function _address(...args) {
  return testAddressNode.nodeBuilder.apply(this, args);
}

function _reverb(...args) {
  return testReverbNode.nodeBuilder.apply(this, args);
}

function _chorus(...args) {
  return testChorusNode.nodeBuilder.apply(this, args);
}

function _delay(...args) {
  return testDelayNode.nodeBuilder.apply(this, args);
}

function _lp(...args) {
  return testLowpassNode.nodeBuilder.apply(this, args);
}

function _hp(...args) {
  return testHighpassNode.nodeBuilder.apply(this, args);
}

function _bp(...args) {
  return testBandpassNode.nodeBuilder.apply(this, args);
}

function _sin(...args) {
  return testContinuousSinNode.nodeBuilder.apply(this, args);
}

function _squ(...args) {
  return testContinuousSquNode.nodeBuilder.apply(this, args);
}

function _saw(...args) {
  return testContinuousSawNode.nodeBuilder.apply(this, args);
}

function _tri(...args) {
  return testContinuousTriNode.nodeBuilder.apply(this, args);
}

function _envSin(...args) {
  return testEnvelopedSinNode.nodeBuilder.apply(this, args);
}

function _envSqu(...args) {
  return testEnvelopedSquNode.nodeBuilder.apply(this, args);
}

function _envSaw(...args) {
  return testEnvelopedSawNode.nodeBuilder.apply(this, args);
}

function _envTri(...args) {
  return testEnvelopedTriNode.nodeBuilder.apply(this, args);
}

function _waveshaper(...args) {
  return testWaveshaperNode.nodeBuilder.apply(this, args);
}

function _samp(...args) {
  return testSamplerNode.nodeBuilder.apply(this, args);
}

function _map(...args) {
  return testMessageMapNode.nodeBuilder.apply(this, args);
}

function _filter(...args) {
  return testMessageFilterNode.nodeBuilder.apply(this, args);
}

function _messageDelay(...args) {
  return testMessageDelayNode.nodeBuilder.apply(this, args);
}

function _messageThreshold(...args) {
  return testMessageThresholdNode.nodeBuilder.apply(this, args);
}

function _bitcrusher(...args) {
  return testBitcrusherNode.nodeBuilder.apply(this, args);

}

function _envNoise(...args) {
  return testEnvelopedNoiseNode.nodeBuilder.apply(this, args);
}

function _gate(...args) {
  return testGateNode.nodeBuilder.apply(this, args);
}

function _thresholdEventProcessor(...args) {
  return testThresholdEventNode.nodeBuilder.apply(this, args);
}

function _toScale(...args) {
  return testMessageScaleLockNode.nodeBuilder.apply(this, args);
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
    this.wvshp = _waveshaper.bind(this);
    this.samp = _samp.bind(this);
    this.map = _map.bind(this);
    this.filter = _filter.bind(this);
    this.pan = _pan.bind(this);
    this.msgDelay = _messageDelay.bind(this);
    this.msgThresh = _messageThreshold.bind(this);
    this.crush = _bitcrusher.bind(this);
    this.envNoise = _envNoise.bind(this);
    this.gate = _gate.bind(this);
    this.threshEvent = _thresholdEventProcessor.bind(this);
    this.toScale = _toScale.bind(this);

    this.envSin = _envSin.bind(this);
    this.envSqu = _envSqu.bind(this);
    this.envSaw = _envSaw.bind(this);
    this.envTri = _envTri.bind(this);
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
