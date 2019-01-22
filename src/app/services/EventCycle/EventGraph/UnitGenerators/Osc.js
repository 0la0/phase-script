import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedOscilator from 'services/audio/synth/EnvelopedOscilator';

const GAIN_VALUE = 1;
const DIV = 1000;

export default class EnvelopedOsc {
  constructor(attack, sustain, release) {
    this.asr = {
      attack: attack / DIV,
      sustain: sustain / DIV,
      release: release / DIV,
    };
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
  }

  schedule(message) {
    const note = message.note !== undefined ? message.note : 60;
    const outputs = [...this.eventModel.getOutlets()];
    // envelopedOscilator(note, message.time.audio, this.asr, this.oscType, GAIN_VALUE, outputs, this.signalCarrier.getInput());
    envelopedOscilator(note, message.time.audio, this.asr, this.oscType, GAIN_VALUE, outputs);
  }

  static fromParams({ attack, sustain, release, }) {
    return new EnvelopedOsc(attack, sustain, release);
  }
}
