import audioGraph from 'services/audio/Graph';
import { getOscillatorType, } from 'services/audio/synth/Oscillators';
import { isPrimitiveWaveform, getPeriodicWave, } from './wavetableProvider';

export default function applyTypeToOscillator(oscillator, type) {
  if (isPrimitiveWaveform(type)) {
    oscillator.type = getOscillatorType(type);
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
