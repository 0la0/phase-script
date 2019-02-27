import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';

export default class MessageDelay extends BaseUnitGenerator {
  constructor(delayTime) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_FILTER', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.delayTime = delayTime ? (delayTime / 1000) : 0;
  }

  schedule(message) {
    const modifiedTime = message.getTime().clone().add(this.delayTime);
    const modifiedMessage = message.clone().setTime(modifiedTime);
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
  }

  static fromParams({ delayTime, }) {
    return new MessageDelay(delayTime);
  }
}
