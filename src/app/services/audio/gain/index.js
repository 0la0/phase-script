import audioGraph from 'services/audio/graph';

export default class Gain  {
  constructor(gainValue) {
    const audioContext = audioGraph.getAudioContext();
    this.gain = audioContext.createGain();
    if (gainValue !== undefined) {
      this.setValue(gainValue);
    }
  }

  connect(node) {
    this.gain.connect(node);
  }

  disconnect(node) {
    this.gain.disconnect(node);
  }

  getInput() {
    return this.gain;
  }

  setValue(gain) {
    this.gain.gain.setValueAtTime(gain, 0);
    return this;
  }

  setValueAtTime(gain, scheduledTime) {
    const time = (scheduledTime === undefined) ? 0 : scheduledTime;
    this.gain.gain.linearRampToValueAtTime(gain, time);
    return this;
  }

  getGainParam() {
    return this.gain.gain;
  }
}
