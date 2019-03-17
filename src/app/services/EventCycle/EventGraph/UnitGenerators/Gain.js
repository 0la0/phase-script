import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import Gain from 'services/audio/gain';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import SignalParameter from './_SignalParameter';

export default class PatchGain extends BaseUnitGenerator {
  constructor(gainValue) {
    super();
    const defaultGainValue = typeof gainValue === 'number' ? gainValue : 0.8;
    this.gain = new Gain();
    this.audioModel = new PatchAudioModel('GAIN', this.gain, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
    this.paramMap = {
      gainValue: new SignalParameter(this.gain.getGainParam(), defaultGainValue),
    };
  }

  updateParams({ gainValue, }, time) {
    this.paramMap['gainValue'].setParamValueAtTime(gainValue, time);
  }

  updateDynamicParam(dynamicParam) {
    this.paramMap['gainValue'].setDynamicParam(dynamicParam);
  }

  // TODO: remove all `modulatWith` usage
  modulateWith(node) {
    node.getAudioModel().connectToModulationSource(this.audioModel);
  }

  static fromParams({ gainValue, }) {
    return new PatchGain(gainValue);
  }
}
