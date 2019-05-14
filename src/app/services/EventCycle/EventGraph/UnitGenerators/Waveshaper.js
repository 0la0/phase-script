import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Waveshaper from 'services/audio/waveshaper';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter, { InputType, } from './_SignalParameter';

export default class PatchWaveshaper extends BaseUnitGenerator {
  constructor({ type, wet }) {
    super();
    const defaultWet = this._ifNumberOr(wet, 0.5);
    this.waveshaper = new Waveshaper(type);
    this.audioModel = new PatchAudioModel('WAVESHAPER', this.waveshaper, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      wet: new SignalParameter(this.waveshaper.getWetParam(), defaultWet, new InputType().numeric().message().build()),
    };
  }

  static fromParams(params) {
    return new PatchWaveshaper(params);
  }
}
