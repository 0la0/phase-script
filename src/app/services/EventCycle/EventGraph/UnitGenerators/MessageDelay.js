import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import DiscreteSignalParameter from './_DiscreteSignalParameter';

const normalizeTime = time => time / 1000;

export default class MessageDelay extends BaseUnitGenerator {
  constructor(delayTime) {
    super();
    const defaultDelayTime = this._ifNumberOr(delayTime, 0);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_DELAY', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.paramMap = {
      delayTime: new DiscreteSignalParameter(defaultDelayTime, normalizeTime),
    };
  }

  schedule(message) {
    setTimeout(() => {
      const delayTime = this.paramMap.delayTime.getValueForTime(message.time);
      const modifiedTime = message.getTime().clone().add(delayTime);
      const modifiedMessage = message.clone().setTime(modifiedTime);
      this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
    });
  }

  static fromParams({ delayTime, }) {
    return new MessageDelay(delayTime);
  }
}
