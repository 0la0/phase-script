const shorthandTypes = {
  sin: 'sine',
  squ: 'square',
  saw: 'sawtooth',
  tri: 'triangle',
};

export const getOscillatorType = key => shorthandTypes[key];
