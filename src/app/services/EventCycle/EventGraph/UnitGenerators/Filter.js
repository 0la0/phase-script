import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import ResFilter from 'services/audio/resFilter';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import SignalParameter, { InputType } from './_SignalParameter';

export default class PatchFilter extends BaseUnitGenerator {
  constructor({ type, frequency, q, }) {
    super();
    const defaultFrequency = this._ifNumberOr(frequency, 5000);
    const defaultQ = this._ifNumberOr(q, 1);
    this.filter = new ResFilter(type, defaultFrequency, defaultQ);
    this.audioModel = new PatchAudioModel('FILTER', this.filter, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      frequency: new SignalParameter(this.filter.getFilterParam(), defaultFrequency, new InputType().numeric().message().signal().build()),
      q: new SignalParameter(this.filter.getQParam(), defaultQ, new InputType().numeric().message().signal().build()),
    };
  }

  static fromParams(params) {
    return new PatchFilter(params);
  }
}
