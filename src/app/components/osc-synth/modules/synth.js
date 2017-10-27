import {OSCILATORS, Osc} from './Osc';
import audioGraph from 'services/audioGraph';
import {ArEnvelope} from 'services/audioUtil/Envelopes';
import {mtof} from 'services/midi/util';


// flow: oscillator -> adsr -> gain -> abstractOutput

function buildOsc(type, output) {
  const synth = new Osc(type);
  const gain = audioGraph.getAudioContext().createGain();
  gain.gain.value = 0.5;
  gain.connect(output);
  return {gain, synth};
}

export default class SynthContainer {

  constructor() {
    // 0.5 => 500ms
    this.asr = {
      attack: 0.01,
      sustain: 0.5,
      release: 0.1
    };
    this.oscillators = ['SINE'];
    this.output = audioGraph.getOutput();
  }

  playNote(midiNote, onTime, offTime) {
    const frequency = mtof(midiNote);
    this.playFrequency(frequency, onTime, offTime);
  }

  playFrequency(frequency, onTime, offTime) {
    this.oscillators.forEach(type => {
      const osc = buildOsc(type, this.output);
      const envelope = new ArEnvelope(this.asr.attack, this.asr.release).build(osc.gain, onTime, offTime);
      osc.synth.play(frequency, envelope, onTime, offTime + this.asr.release);
    });
  }

  setOscilator(index, type) {
    if (index < 0 || index >= this.synthList.length) {
      throw new Error('index out of bounds, SynthContainer.setOscilator', arguments);
    }
    this.synthList[index].synth.setOscilator(type);
  }

}
