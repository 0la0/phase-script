import audioGraph from 'services/audio/Graph';
import WetLevel from 'services/audio/WetLevel';

export default class Bitcrusher  {
  constructor() {
    const audioContext = audioGraph.getAudioContext();
    this.bitcrusher = new AudioWorkletNode(audioContext, 'Bitcrusher');
    this.input = audioContext.createGain();
    this.wetLevel = new WetLevel(audioContext, this.input, this.bitcrusher);
    this.input.connect(this.bitcrusher);
  }

  connect(node) {
    this.wetLevel.connect(node);
  }

  disconnect(node) {
    this.wetLevel.disconnect(node);
  }

  getInput() {
    return this.input;
  }

  getBitDepthParam() {
    return this.bitcrusher.parameters.get('bitDepth');
  }

  getFrequencyReductionParam() {
    return this.bitcrusher.parameters.get('frequencyReduction');
  }

  getWetParam() {
    return this.wetLevel;
  }
}
