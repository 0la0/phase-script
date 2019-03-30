import Types from './Types';

export default {
  pattern: {
    fn: 'p',
    description: 'Create a pattern',
    returnType: 'pattern',
    params: [
      {
        name: 'patternString',
        type: Types.STRING,
      },
    ]
  },
  degrade: {
    fn: 'degrade',
    description: 'Allow a random number of events, specified by the amount. (degrade(0) allows all messages, degrade(1) allows no messages)',
    returnType: 'pattern',
    params: [
      {
        name: 'amount',
        type: Types.NUMBER,
      },
    ]
  },
  every: {
    fn: 'every',
    description: 'Modify pattern every n times',
    returnType: 'pattern',
    params: [
      {
        name: 'modulo',
        type: Types.NUMBER,
      },
      {
        name: 'patternModifier',
        type: Types.PATTERN_MODIFIER,
      },
    ]
  },
  offset: {
    fn: 'offset',
    description: 'Offset pattern by relative amount [0 - 1]',
    returnType: 'pattern',
    params: [
      {
        name: 'amount',
        type: Types.NUMBER,
      },
    ]
  },
  repeat: {
    fn: 'repeat',
    description: 'Repeat the pattern n times',
    returnType: 'pattern',
    params: [
      {
        name: 'amount',
        type: Types.NUMBER,
      },
    ]
  },
  reverse: {
    fn: 'reverse',
    description: 'Reverse the pattern',
    returnType: 'pattern',
    params: []
  },
  rotate: {
    fn: 'rotate',
    description: 'Rotate the pattern by by relative amount [0 - 1]',
    returnType: 'pattern',
    params: [
      {
        name: 'amount',
        type: Types.NUMBER,
      },
    ]
  },
  speed: {
    fn: 'speed',
    description: 'Modify pattern speed ... speed(0.5) is 2x fast, speed(2) is 1/2x fast',
    returnType: 'pattern',
    params: [
      {
        name: 'amount',
        type: Types.NUMBER,
      },
    ]
  },
};
