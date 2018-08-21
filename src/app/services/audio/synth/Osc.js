import audioGraph from 'services/audio/graph';
import {mtof} from 'services/midi/util';
import { AsrEnvelope } from 'services/audio/util/Envelopes';

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

  setType(type) {
    this.type = OSCILATORS[type] || OSCILATORS.SINE;
  }

  playNote(midiNote, startTime, asr, gain, outputs) {
    const frequency = mtof(midiNote);
    const endTime = startTime + asr.attack + asr.sustain + asr.release;
    const osc = audioGraph.getAudioContext().createOscillator();
    const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
      .build(startTime, gain);
    osc.connect(envelope);
    outputs.forEach(output => envelope.connect(output));
    osc.type = this.type;
    osc.frequency.setValueAtTime(frequency, 0);
    osc.start(startTime);
    osc.stop(endTime);
  }

  // TODO: remove
  play(frequency, adsrEnvelope, startTime, offTime) {
    const osc = audioGraph.getAudioContext().createOscillator();
    osc.connect(adsrEnvelope);
    osc.type = this.type;
    osc.frequency.setValueAtTime(frequency, 0);
    osc.start(startTime);
    osc.stop(offTime);
  }
}

export {OSCILATORS};
