import getDefaultSamples from './defaultSamples';

class SampleBank {
  constructor() {
    this.samples = new Map();
    getDefaultSamples().then(nameBufferPairs =>
      nameBufferPairs.forEach(({ name, audioBuffer }) => this.samples.set(name, audioBuffer)));
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
