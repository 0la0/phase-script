import scales from 'services/scale/scales';
import { CARRIER_NAMES } from 'services/audio/waveshaper/carrierFunctions';

const defaultWaveforms = [ 'sin', 'squ', 'saw', 'tri', ];
const waveforms = defaultWaveforms.concat(wavetableNames); // eslint-disable-line no-undef

export const PARAM_TYPES = {
  FLOAT: 'float',
  FUNCTION: 'function',
  STRING: 'string',
  GRAPH_NODE: 'graphNode',
  NUMBER: 'number',
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
      isTaggable: true,
    }
  ]
};

// const chorusNode = {
//   name: 'CHORUS',
//   fnName: 'chorus',
//   paramDefinitions: [
//     {
//       paramName: 'frequency',
//       type: PARAM_TYPES.FLOAT,
//     },
//     {
//       paramName: 'depth',
//       type: PARAM_TYPES.FLOAT,
//     },
//     {
//       paramName: 'feedback',
//       type: PARAM_TYPES.FLOAT,
//     },
//     {
//       paramName: CONSTANTS.ID,
//       type: PARAM_TYPES.NUMBER,
//       isTaggable: true,
//     }
//   ]
// };

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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
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
      enum: Object.keys(CARRIER_NAMES),
    },
    {
      paramName: 'wet',
      type: PARAM_TYPES.FLOAT,
    },
    {
      paramName: CONSTANTS.ID,
      type: PARAM_TYPES.NUMBER,
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

const messageMidiCcOut = {
  name: 'MSG_MIDI_CC_OUT',
  fnName: 'midiCc',
  paramDefinitions: [
    {
      paramName: 'deviceName',
      type: PARAM_TYPES.STRING,
    },
    {
      paramName: 'channel',
      type: PARAM_TYPES.NUMBER,
    },
    {
      paramName: 'note',
      type: PARAM_TYPES.NUMBER,
    }
  ]
};

const messageMidiNoteOut = {
  name: 'MSG_MIDI_NOTE_OUT',
  fnName: 'midiNote',
  paramDefinitions: [
    {
      paramName: 'deviceName',
      type: PARAM_TYPES.STRING,
    },
    {
      paramName: 'channel',
      type: PARAM_TYPES.NUMBER,
    },
    {
      paramName: 'note',
      type: PARAM_TYPES.NUMBER,
    },
    {
      paramName: 'duration',
      type: PARAM_TYPES.NUMBER,
    },
  ]
};

const messageMidiIn = {
  name: 'MSG_MIDI_IN',
  fnName: 'midiIn',
  paramDefinitions: [
    {
      paramName: 'deviceName',
      type: PARAM_TYPES.STRING,
    },
    {
      paramName: 'channel',
      type: PARAM_TYPES.NUMBER,
    },
    {
      paramName: 'note',
      type: PARAM_TYPES.NUMBER,
    },
    {
      paramName: 'address',
      type: PARAM_TYPES.STRING,
    },
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
      type: PARAM_TYPES.NUMBER,
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
      enum: Object.keys(scales),
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
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
      type: PARAM_TYPES.NUMBER,
      isTaggable: true,
    }
  ]
};

const envelopedOscNode = {
  name: 'ENVELOPED_OSC',
  fnName: 'envOsc',
  paramDefinitions: [
    {
      paramName: 'waveform',
      type: PARAM_TYPES.STRING,
      enum: waveforms,
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
    },
    {
      paramName: 'modulator',
      type: PARAM_TYPES.GRAPH_NODE,
      isOptional: true,
    },
  ],
};

const continuousOscNode = {
  name: 'CONTINUOUS_OSC',
  fnName: 'osc',
  paramDefinitions: [
    {
      paramName: 'waveform',
      type: PARAM_TYPES.STRING,
      enum: waveforms,
    },
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
      type: PARAM_TYPES.NUMBER,
      isTaggable: true,
    }
  ],
};

export default [
  gainNode,
  panNode,
  dacNode,
  addressNode,
  reverbNode,
  // chorusNode,
  delayNode,
  lowpassNode,
  highpassNode,
  bandpassNode,
  waveshaperNode,
  samplerNode,
  messageMapNode,
  messageFilterNode,
  messageDelayNode,
  messageMidiCcOut,
  messageMidiIn,
  messageMidiNoteOut,
  messageThresholdNode,
  messageScaleLockNode,
  envelopedNoiseNode,
  bitcrusherNode,
  gateNode,
  thresholdEventNode,
  envelopedOscNode,
  continuousOscNode,
];
