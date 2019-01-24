import audioGraph from 'services/audio/graph';
import OSCILLATORS from 'services/audio/synth/Oscillators';

export default class ContinuousOsc {
  constructor(type) {
    this.setType(type);
    this.outputs = new Set([]);
    this.isOn = false;
  }

  setType(type) {
    this.type = OSCILLATORS[type] || OSCILLATORS.SINE;
  }

  connect(node) {
    this.outputs.add(node);
    if (this.osc) {
      this.osc.connect(node);
    }
  }

  disconnect(node) {
    this.outputs.delete(node);
    if (this.osc) {
      this.osc.disconnect(node);
    }
  }

  start(frequency, startTime) {
    this.osc = audioGraph.getAudioContext().createOscillator();
    this.osc.type = this.type;
    this.outputs.forEach(output => this.osc.connect(output));
    this.osc.start(startTime);
  }

  stop(offTime) {
    this.osc.stop(offTime);
    this.osc = undefined;
  }

  setFrequency(frequency, time) {
    if (!this.osc) { return; }
    const targetTime = (time === undefined) ? 0 : time;
    this.osc.frequency.setValueAtTime(frequency, targetTime);
  }
}
