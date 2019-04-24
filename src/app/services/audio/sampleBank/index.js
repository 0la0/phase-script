import loadSample from './SampleLoader';

const BASE_PATH = 'app/assets/audio/';

const fileMap = {
  'hat': `${BASE_PATH}hat_loFi.wav`,
  'snare': `${BASE_PATH}snare_gb03.wav`,
  'kick': `${BASE_PATH}eKick1.wav`,
  'high_pluck': `${BASE_PATH}cogs4.wav`,
  'lo_fi_bright': `${BASE_PATH}snare_loFi_bright.wav`,
  'lo_fi_muff': `${BASE_PATH}snare_loFi_muff.wav`,
  'click': `${BASE_PATH}spatialized6.wav`,
  'pop': `${BASE_PATH}vinyl9.wav`,
  'metal': `${BASE_PATH}woodClog51.wav`,
  'tom_pop': `${BASE_PATH}woodClog60.wav`,
  'drake': `${BASE_PATH}drakeVoice.wav`
};

class SampleBank {
  constructor() {
    this.samples = new Map();
    const loadSamples = Object.keys(fileMap).map(key =>
      loadSample(fileMap[key]).then(sampleBuffer => this.samples.set(key, sampleBuffer)));
    Promise.all(loadSamples);
  }

  getSampleKeys() {
    return Array.from(this.samples.keys());
  }

  getAudioBuffer(sampleKey) {
    return this.samples.get(sampleKey);
  }

  addSample(name, audioBuffer) {
    this.samples.set(name, audioBuffer);
  }
}

export default new SampleBank();
