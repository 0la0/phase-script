import audioGraph from 'services/audio/graph';
import {mtof} from 'services/midi/util';

const OSCILATORS = {
  SINE: 'sine',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth',
  TRIANGLE: 'triangle'
};

export default class Osc {

  constructor(type) {
    this.setType(type);
  }

  playNote(midiNote, onTime, offTime, outputs) {
    const frequency = mtof(midiNote);
    const osc = audioGraph.getAudioContext().createOscillator();
    outputs.forEach(output => osc.connect(output));
    osc.type = this.type;
    osc.frequency.setValueAtTime(frequency, 0);
    osc.start(onTime);
    osc.stop(offTime);
  }

  // TODO: remove
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
