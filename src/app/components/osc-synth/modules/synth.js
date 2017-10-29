import {OSCILATORS, Osc} from './Osc';
import audioGraph from 'services/audioGraph';
import {ArEnvelope} from 'services/audioUtil/Envelopes';
import {mtof} from 'services/midi/util';

// flow: oscillator -> adsr -> gain -> abstractOutput

function buildOsc(oscillator, output) {
  const synth = new Osc(oscillator.type);
  const gain = audioGraph.getAudioContext().createGain();
  gain.gain.value = oscillator.gain;
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
    this.output = audioGraph.getOutput();
  }

  playNote(midiNote, oscillators, onTime, offTime) {
    const frequency = mtof(midiNote);
    this.playFrequency(frequency, oscillators, onTime, offTime);
  }

  playFrequency(frequency, oscillators, onTime, offTime) {
    oscillators.forEach(oscillator => {
      const osc = buildOsc(oscillator, this.output);
      const envelope = new ArEnvelope(this.asr.attack, this.asr.release).build(osc.gain, onTime, offTime);
      osc.synth.play(frequency, envelope, onTime, offTime + this.asr.release);
    });
  }

  setAttack(attack) {
    this.asr.attack = attack;
  }

  getAttack() {
    return this.asr.attack;
  }

  setRelease(release) {
    this.asr.release = release;
  }

  getRelease() {
    return this.asr.release;
  }

}
