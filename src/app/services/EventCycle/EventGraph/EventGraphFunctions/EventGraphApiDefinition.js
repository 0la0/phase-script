export const PARAM_TYPES = {
  FLOAT: 'float',
  FUNCTION: 'function',
  STRING: 'string',
  GRAPH_NODE: 'graphNode'
};
export const CONSTANTS = {
  ID: 'ID',
};

const gainNode = {
  name: 'GAIN',
  fnName: 'gain',
  paramDefinitions: [
    {
      paramName: 'gainValue',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
    }
  ]
};

const panNode = {
  name: 'PANNER',
  fnName: 'pan',
  paramDefinitions: [
    {
      paramName: 'panValue',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
    }
  ]
};

const dacNode = {
  name: 'DAC',
  fnName: 'dac',
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
  fnName: 'addr',
  paramDefinitions: [
    {
      paramName: 'address',
      type: PARAM_TYPES.STRING,
    }
  ]
};

const reverbNode = {
  name: 'REVERB',
  fnName: 'reverb',
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
    }
  ]
};

const chorusNode = {
  name: 'CHORUS',
  fnName: 'chorus',
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
    }
  ]
};

const delayNode = {
  name: 'DELAY',
  fnName: 'delay',
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
    }
  ]
};

const lowpassNode = {
  name: 'FILTER',
  fnName: 'lp',
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
    }
  ]
};

const highpassNode = {
  name: 'FILTER',
  fnName: 'hp',
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
    }
  ]
};

const bandpassNode = {
  name: 'FILTER',
  fnName: 'bp',
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
    }
  ]
};

const waveshaperNode = {
  name: 'WAVESHAPER',
  fnName: 'wvshp',
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
    }
  ]
};

const samplerNode = {
  name: 'SAMPLER',
  fnName: 'samp',
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
  fnName: 'map',
  paramDefinitions: [
    {
      paramName: 'mapFn',
      type: PARAM_TYPES.FUNCTION,
    }
  ]
};

const messageFilterNode = {
  name: 'MSG_FILTER',
  fnName: 'filter',
  paramDefinitions: [
    {
      paramName: 'filterFn',
      type: PARAM_TYPES.FUNCTION,
    }
  ]
};

const messageDelayNode = {
  name: 'MSG_DELAY',
  fnName: 'msgDelay',
  paramDefinitions: [
    {
      paramName: 'delayTime',
      type: PARAM_TYPES.FLOAT,
    }
  ]
};

const messageThresholdNode = {
  name: 'MSG_THRESH',
  fnName: 'msgThresh',
  paramDefinitions: [
    {
      paramName: 'threshold',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
    }
  ]
};

const messageScaleLockNode = {
  name: 'MSG_SCALE_LOCK',
  fnName: 'toScale',
  paramDefinitions: [
    {
      paramName: 'scaleName',
      type: PARAM_TYPES.STRING,
    }
  ]
};

const envelopedNoiseNode = {
  name: 'ENVELOPED_NOISE',
  fnName: 'envNoise',
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
  fnName: 'crush',
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
    }
  ]
};

const gateNode = {
  name: 'GATE',
  fnName: 'gate',
  paramDefinitions: [
    {
      paramName: 'threshold',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      isTaggable: true,
    }
  ]
};

const thresholdEventNode = {
  name: 'THRESH_EVENT',
  fnName: 'threshEvent',
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
    }
  ]
};

const envelopedOscParams = [
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
    paramName: 'modulator',
    type: PARAM_TYPES.GRAPH_NODE,
    isOptional: true,
  },
  {
    paramName: CONSTANTS.ID,
    isTaggable: true,
  },
];

const envelopedSinNode = {
  name: 'ENVELOPED_OSC',
  fnName: 'envSin',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'sin',
      isTaggable: true,
    }
  ],
  paramDefinitions: envelopedOscParams,
};

const envelopedSquNode = {
  name: 'ENVELOPED_OSC',
  fnName: 'envSqu',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'squ',
      isTaggable: true,
    }
  ],
  paramDefinitions: envelopedOscParams,
};

const envelopedSawNode = {
  name: 'ENVELOPED_OSC',
  fnName: 'envSaw',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'saw',
      isTaggable: true,
    }
  ],
  paramDefinitions: envelopedOscParams,
};

const envelopedTriNode = {
  name: 'ENVELOPED_OSC',
  fnName: 'envTri',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'tri',
      isTaggable: true,
    }
  ],
  paramDefinitions: envelopedOscParams,
};

const continuousOscParams = [
  {
    paramName: 'frequency',
    type: PARAM_TYPES.FLOAT,
  },
  {
    paramName: 'modulator',
    type: PARAM_TYPES.GRAPH_NODE,
    isOptional: true,
  },
  {
    paramName: CONSTANTS.ID,
    isTaggable: true,
  }
];

const continuousSinNode = {
  name: 'CONTINUOUS_OSC',
  fnName: 'sin',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'sin',
      isTaggable: true,
    }
  ],
  paramDefinitions: continuousOscParams,
};

const continuousSquNode = {
  name: 'CONTINUOUS_OSC',
  fnName: 'squ',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'squ',
      isTaggable: true,
    }
  ],
  paramDefinitions: continuousOscParams,
};

const continuousSawNode = {
  name: 'CONTINUOUS_OSC',
  fnName: 'saw',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'saw',
      isTaggable: true,
    }
  ],
  paramDefinitions: continuousOscParams,
};

const continuousTriNode = {
  name: 'CONTINUOUS_OSC',
  fnName: 'tri',
  constantDefinitions: [
    {
      paramName: 'oscType',
      value: 'tri',
      isTaggable: true,
    }
  ],
  paramDefinitions: continuousOscParams,
};

export default [
  gainNode,
  panNode,
  dacNode,
  addressNode,
  reverbNode,
  chorusNode,
  delayNode,
  lowpassNode,
  highpassNode,
  bandpassNode,
  waveshaperNode,
  samplerNode,
  messageMapNode,
  messageFilterNode,
  messageDelayNode,
  messageThresholdNode,
  messageScaleLockNode,
  envelopedNoiseNode,
  bitcrusherNode,
  gateNode,
  thresholdEventNode,
  envelopedSinNode,
  envelopedSquNode,
  envelopedSawNode,
  envelopedTriNode,
  continuousSinNode,
  continuousSquNode,
  continuousSawNode,
  continuousTriNode,
];
