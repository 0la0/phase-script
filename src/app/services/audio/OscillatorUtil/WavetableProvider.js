import PeriodicWave from './PeriodicWave';

let periodicWaves = {};

import('./Wavetables')
  .then((wavetablesModule) => {
    const wavetables = wavetablesModule.default;
    periodicWaves = Object.keys(wavetables)
      .reduce((obj, key) => Object.assign(obj, { [key]: new PeriodicWave(wavetables[key]) }), {});
  })
  .catch(error => console.log('Import Wavetables error:', error));

export const getPeriodicWave = waveform => periodicWaves[waveform];
