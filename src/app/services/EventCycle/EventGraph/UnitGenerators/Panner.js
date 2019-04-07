import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import StereoPanner from 'services/audio/stereoPanner';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter, { InputType } from './_SignalParameter';

export default class PatchPanner extends BaseUnitGenerator {
  constructor({ panValue, }) {
    super();
    const defaultPanValue = this._ifNumberOr(panValue, 0);
    this.stereoPanner = new StereoPanner(defaultPanValue);
    this.audioModel = new PatchAudioModel('STEREO_PANNER', this.stereoPanner, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      panValue: new SignalParameter(this.stereoPanner.getPanParam(), defaultPanValue, new InputType().numeric().message().signal().build()),
    };
  }

  static fromParams(params) {
    return new PatchPanner(params);
  }
}
