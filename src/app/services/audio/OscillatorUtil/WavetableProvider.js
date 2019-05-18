import PeriodicWave from './PeriodicWave';
import wavetables from './Wavetables';

const periodicWaves = Object.keys(wavetables)
  .reduce((obj, key) => Object.assign(obj, { [key]: new PeriodicWave(wavetables[key]) }), {});

export const getPeriodicWave = waveform => periodicWaves[waveform];
