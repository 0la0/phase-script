import audioGraph from 'services/audio/Graph';

export default class ResFilter {
  constructor(type, frequency, q) {
    const audioContext = audioGraph.getAudioContext();
    this.output = audioContext.createGain();
    this.filter = audioContext.createBiquadFilter();
    this.filter.type = type || 'lowpass';
    this.filter.frequency.value = frequency || 400;
    this.filter.Q.value = q || 1;
    this.filter.gain.value = 0;
    this.filter.connect(this.output);
  }

  connect(node) {
    this.output.connect(node);
  }

  disconnect(node) {
    this.output.disconnect(node);
  }

  getInput() {
    return this.filter;
  }

  setType(type) {
    this.filter.type = type;
  }

  setFrequency(frequency, time) {
    if (time) {
      this.filter.frequency.linearRampToValueAtTime(frequency, time);
    } else {
      this.filter.frequency.value = frequency;
    }
  }

  setResonance(resonance, time) {
    if (time) {
      this.filter.Q.linearRampToValueAtTime(resonance, time);
    } else {
      this.filter.Q.value = resonance;
    }
  }

  updateParams(frequency, q, time) {
    this.filter.frequency.linearRampToValueAtTime(frequency, time);
    this.filter.Q.linearRampToValueAtTime(q, time);
  }

  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    return this.filter.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }

  getFilterParam() {
    return this.filter.frequency;
  }

  getQParam() {
    return this.filter.Q;
  }
}
