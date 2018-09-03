import audioGraph from 'services/audio/graph';

export default class EqThree {
  constructor() {
    const audioContext = audioGraph.getAudioContext();
    this.lo = audioContext.createBiquadFilter();
    this.lo.type = 'lowshelf';
    this.lo.frequency.value = 400;
    this.lo.gain.value = 0;

    this.mid = audioContext.createBiquadFilter();
    this.mid.type = 'peaking';
    this.mid.frequency.value = 1000;
    this.mid.Q.value = 0.75;
    this.mid.gain.value = 0;

    this.hi = audioContext.createBiquadFilter();
    this.hi.type = 'highshelf';
    this.hi.frequency.value = 3000;
    this.hi.gain.value = 0;

    this.mid.connect(this.hi);
    this.lo.connect(this.mid);
  }

  connect(node) {
    this.hi.connect(node);
  }

  disconnect(node) {
    this.hi.disconnect(node);
  }

  getInput() {
    return this.lo;
  }

  setLowFrequency(frequency) {
    this.lo.frequency.value = frequency;
  }

  setLowGain(qValue) {
    this.lo.gain.setValueAtTime(qValue, 0);
  }

  setMidFrequency(frequency) {
    this.mid.frequency.value = frequency;
  }

  setMidGain(gain) {
    this.mid.gain.setValueAtTime(gain, 0);
  }

  setMidQ(qValue) {
    this.mid.Q.value = qValue;
  }

  setHighFrequency(frequency) {
    this.hi.frequency.value = frequency;
  }

  setHiGain(gain) {
    this.hi.gain.setValueAtTime(gain, 0);
  }
}
