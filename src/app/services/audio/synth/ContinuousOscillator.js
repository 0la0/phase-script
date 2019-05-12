import audioGraph from 'services/audio/graph';
import applyTypeToOscillator from './OscillatorTypeUtil';

export default class ContinuousOsc {
  constructor(frequency, type) {
    this.frequency = frequency || 440;
    this.gain = audioGraph.getAudioContext().createGain();
    this.gain.gain.setValueAtTime(0, 0);
    this.osc = audioGraph.getAudioContext().createOscillator();
    applyTypeToOscillator(this.osc, type);
    this.osc.frequency.value = frequency;
    this.osc.type = this.type;
    this.osc.connect(this.gain);
    this.osc.start();
  }

  connect(node) {
    this.gain.connect(node);
  }

  disconnect(node) {
    this.osc.disconnect();
    this.gain.disconnect(node);
  }

  getFrequencyParam() {
    return this.osc.frequency;
  }

  startAtTime(time = 0) {
    this.gain.gain.setValueAtTime(1, time);
  }

  stop(time = 0) {
    this.gain.gain.setValueAtTime(0, time);
  }
}
