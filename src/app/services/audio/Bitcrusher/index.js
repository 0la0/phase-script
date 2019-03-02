import audioGraph from 'services/audio/graph';

export default class Bitcrusher  {
  constructor(bitDepth, freqReduction, wet) {
    const audioContext = audioGraph.getAudioContext();
    this.bitcrusher = new AudioWorkletNode(audioContext, 'Bitcrusher');
    this.input = audioContext.createGain();
    this.dryGain = audioContext.createGain();
    this.wetGain = audioContext.createGain();
    this.input.connect(this.dryGain);
    this.input.connect(this.bitcrusher);
    this.bitcrusher.connect(this.wetGain);
    this.setParamsAtTime(bitDepth, freqReduction, wet, 0);
  }

  connect(node) {
    this.dryGain.connect(node);
    this.wetGain.connect(node);
  }

  disconnect(node) {
    this.dryGain.disconnect(node);
    this.wetGain.disconnect(node);
  }

  getInput() {
    return this.input;
  }

  setParamsAtTime(bitDepth = 12, freqReduction = 0.5, wetLevel = 0.5, time = 0) {
    this.bitcrusher.parameters.get('bitDepth').setValueAtTime(bitDepth, time);
    this.bitcrusher.parameters.get('frequencyReduction').setValueAtTime(freqReduction, time);
    this.wetGain.gain.linearRampToValueAtTime(wetLevel, time);
    this.dryGain.gain.linearRampToValueAtTime(1 - wetLevel, time);
    return this;
  }
}
