import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Gain from 'services/audio/gain';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import SignalParameter, { InputType, } from './_SignalParameter';

export default class PatchGain extends BaseUnitGenerator {
  constructor(gainValue) {
    super();
    const defaultGainValue = this._ifNumberOr(gainValue, 0.5);
    this.gain = new Gain();
    this.audioModel = new PatchAudioModel('GAIN', this.gain, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      gainValue: new SignalParameter(this.gain.getGainParam(), defaultGainValue, new InputType().numeric().message().signal().build()),
    };
  }

  static fromParams({ gainValue, }) {
    return new PatchGain(gainValue);
  }
}
