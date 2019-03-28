import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import envelopedOscilator from 'services/audio/synth/EnvelopedOscillator';
import { shorthandTypes } from 'services/audio/synth/Oscillators';
import DiscreteSignalParameter from './_DiscreteSignalParameter';

const GAIN_VALUE = 1;
const DIV = 1000;

const paramTransform = val => val / DIV;

export default class EnvelopedOsc extends BaseUnitGenerator {
  constructor(attack, sustain, release, oscType) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('ENVELOPED_OSC', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.SIGNAL);
    this.modulationInputs = new Set();
    this.paramMap = {
      attack: new DiscreteSignalParameter(attack, paramTransform),
      sustain: new DiscreteSignalParameter(sustain, paramTransform),
      release: new DiscreteSignalParameter(release, paramTransform),
      oscType: new DiscreteSignalParameter(shorthandTypes[oscType], val => val),
      modulator: {
        setParamValue: paramVal => {
          if (paramVal.constructor.name !== 'PatchAudioModel') {
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
      const oscType = this.paramMap.oscType.getValueForTime(message.time);
      envelopedOscilator(note, message.time.audio, asr, oscType, GAIN_VALUE, outputs, this.modulationInputs);
    });
  }

  updateParams(params, time) {
    if (!this.paramMap) {
      return;
    }
    Object.keys(params).forEach((paramKey) => {
      const paramVal = params[paramKey];
      if (paramVal.constructor.name === 'DynamicParameter') {
        console.log('TODO: received dynamicParam, fix');
        return;
      }
      if (!this.paramMap[paramKey]) {
        return;
      }
      this.paramMap[paramKey].setParamValue(paramVal, time);
    });
  }

  static fromParams({ attack, sustain, release, oscType }) {
    return new EnvelopedOsc(attack, sustain, release, oscType);
  }
}
