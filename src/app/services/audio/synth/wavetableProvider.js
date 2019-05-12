import PeriodicWave from './PeriodicWave';
import wavetables from './wavetables';

const primitiveWaveforms = new Set([ 'sin', 'squ', 'saw', 'tri', ]);

const periodicWaves = Object.keys(wavetables)
  .reduce((obj, key) => Object.assign(obj, { [key]: new PeriodicWave(wavetables[key]) }), {});

export const isPrimitiveWaveform = waveform => primitiveWaveforms.has(waveform);

export const getPeriodicWave = waveform => periodicWaves[waveform];
