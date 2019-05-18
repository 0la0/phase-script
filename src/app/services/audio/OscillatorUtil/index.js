import audioGraph from 'services/audio/Graph';
import { getPeriodicWave, } from './WavetableProvider';

const primitiveShorthands = {
  sin: 'sine',
  squ: 'square',
  saw: 'sawtooth',
  tri: 'triangle',
};

export default function applyTypeToOscillator(oscillator, type) {
  const primitiveType = primitiveShorthands[type];
  if (primitiveType) {
    oscillator.type = primitiveType;
  } else {
    const periodicWave = getPeriodicWave(type);
    if (!periodicWave) {
      oscillator.type = 'sine';
    } else {
      // TODO: cache periodic wave
      const wave = audioGraph.getAudioContext().createPeriodicWave(periodicWave.real, periodicWave.imaginary, { disableNormalization: true });
      oscillator.setPeriodicWave(wave);
    }
  }
}
