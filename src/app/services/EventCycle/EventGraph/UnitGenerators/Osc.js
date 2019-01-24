import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedOscilator from 'services/audio/synth/EnvelopedOscillator';
import { shorthandTypes } from 'services/audio/synth/Oscillators';

const GAIN_VALUE = 1;
const DIV = 1000;

export default class EnvelopedOsc {
  constructor(attack, sustain, release, oscType) {
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
    console.log(oscType, shorthandTypes)
    this.oscType = shorthandTypes[oscType];
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const outputs = [...this.eventModel.getOutlets()];
    // envelopedOscilator(note, message.time.audio, this.asr, this.oscType, GAIN_VALUE, outputs, this.signalCarrier.getInput());
    envelopedOscilator(note, message.time.audio, this.asr, this.oscType, GAIN_VALUE, outputs);
  }

  disconnect() {
    this.eventModel.disconnect();
    this.audioModel.disconnect();
  }

  static fromParams({ attack, sustain, release, oscType }) {
    return new EnvelopedOsc(attack, sustain, release, oscType);
  }
}
