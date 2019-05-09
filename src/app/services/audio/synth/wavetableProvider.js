import PeriodicWave from './PeriodicWave';
import wavetables from './wavetables';

const periodicWaves = Object.keys(wavetables)
  .reduce((obj, key) => Object.assign(obj, { [key]: new PeriodicWave(wavetables[key]) }), {});

export default periodicWaves;
