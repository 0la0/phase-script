import provideAudioGraph from 'services/audioGraph/audioGraphProvider';
import {mtof} from 'services/midi/util';

const audioGraph = provideAudioGraph();

export default class Synth {

  constructor() {
    this.osc1 = audioGraph.getAudioContext().createOscillator();
    this.osc2 = audioGraph.getAudioContext().createOscillator();
    this.oscGain = audioGraph.getAudioContext().createGain();
    this.oscGain.gain.value = 0.5;
    this.osc1.type = 'square';
    this.osc2.type = 'sine';
    this.osc1.connect(this.oscGain);
    this.osc2.connect(this.oscGain);
    this.oscGain.connect(audioGraph.getOutput());
    this.oscillators = new Set([this.osc1, this.osc2]);
  }

  // TODO: ASDR instead of on / off
  playNote(midiNote, onTime, offTime) {
    const frequency = mtof(midiNote);
    this.playFrequency(frequency, onTime, offTime);
  }

  playFrequency(frequency, onTime, offTime) {
    this.oscillators.forEach(oscillator => {
      this.osc1.frequency.value = frequency;
      oscillator.start(onTime);
      oscillator.stop(offTime);
    });
  }

}
