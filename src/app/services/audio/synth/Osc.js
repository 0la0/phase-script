import audioGraph from 'services/audio/graph';

const OSCILATORS = {
  SINE: 'sine',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth',
  TRIANGLE: 'triangle'
};

class Osc {

  constructor(type) {
    this.setType(type);
  }

  play(frequency, adsrEnvelope, onTime, offTime) {
    const osc = audioGraph.getAudioContext().createOscillator();
    osc.connect(adsrEnvelope);
    osc.type = this.type;
    osc.frequency.setValueAtTime(frequency, 0);
    osc.start(onTime);
    osc.stop(offTime);
  }

  setType(type) {
    this.type = OSCILATORS[type] || OSCILATORS.SINE;
  }

}

export {OSCILATORS, Osc};
