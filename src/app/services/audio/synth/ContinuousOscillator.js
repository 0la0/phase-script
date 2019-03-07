import audioGraph from 'services/audio/graph';
import OSCILLATORS from 'services/audio/synth/Oscillators';

export default class ContinuousOsc {
  constructor(frequency, type) {
    this.setType(type);
    this.outputs = new Set([]);
    this.isOn = false;
    this.frequency = frequency || 440;
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

  startAtTime(startTime) {
    console.log('startAtTime', startTime)
    this.osc = audioGraph.getAudioContext().createOscillator();
    this.osc.frequency.value = this.frequency;
    this.osc.type = this.type;
    this.outputs.forEach(output => this.osc.connect(output));
    this.osc.start(startTime);
  }

  stop(offTime) {
    if (!this.osc) {
      console.warn('Attempting to stop a non-running oscillator');
      return;
    }
    this.osc.stop(offTime);
    this.osc = undefined;
  }

  setFrequency(frequency, time) {
    if (!this.osc) { return; }
    const targetTime = (time === undefined) ? 0 : time;
    this.osc.frequency.setValueAtTime(frequency, targetTime);
  }
}
