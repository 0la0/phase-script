import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedOscilator from 'services/audio/synth/EnvelopedOscillator';
import { shorthandTypes } from 'services/audio/synth/Oscillators';
import DiscreteSignalParameter from './_DiscreteSignalParameter';
import { msToSec } from 'services/Math';

export default class EnvelopedOsc extends BaseUnitGenerator {
  constructor(attack, sustain, release, oscType) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('ENVELOPED_OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.modulationInputs = new Set();
    this.oscType = oscType;
    this.paramMap = {
      attack: new DiscreteSignalParameter(attack, msToSec),
      sustain: new DiscreteSignalParameter(sustain, msToSec),
      release: new DiscreteSignalParameter(release, msToSec),
      modulator: {
        setParamValue: paramVal => {
          if (!(paramVal instanceof PatchAudioModel)) {
            throw new Error('Modulator must be a PatchAudioModel');
          }
          this.modulationInputs.add(paramVal.connectionFn);
        }
      },
    };
  }

  schedule(message) {
    setTimeout(() => {
      const note = message.note !== undefined ? message.note : 60;
      const outputs = [...this.eventModel.getOutlets()];
      const asr = {
        attack: this.paramMap.attack.getValueForTime(message.time),
        sustain: this.paramMap.sustain.getValueForTime(message.time),
        release: this.paramMap.release.getValueForTime(message.time),
      };
      envelopedOscilator(note, message.time.audio, asr, this.oscType, 1, outputs, this.modulationInputs);
    });
  }

  static fromParams({ attack, sustain, release, oscType }) {
    return new EnvelopedOsc(attack, sustain, release, oscType);
  }
}
