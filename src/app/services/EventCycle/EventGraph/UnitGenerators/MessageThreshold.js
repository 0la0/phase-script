import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';

export default class MessageThreshold extends BaseUnitGenerator {
  constructor(threshold) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_THRESH', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.threshold = threshold;
    this.cnt = 0;
  }

  schedule(message) {
    if (++this.cnt % this.threshold === 0 || this.threshold < 1) {
      this.eventModel.getOutlets().forEach(outlet => outlet.schedule(message));
    }
  }

  updateParams({ threshold, }) {
    if (this.threshold !== threshold) {
      // TODO: reset
      this.threshold = threshold;
    }
  }

  static fromParams({ threshold, }) {
    return new MessageThreshold(threshold);
  }
}
