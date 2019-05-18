import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import PatchEventModel from 'services/AudioParameter/PatchEventModel';

const defaultFilterFn = () => true;

export default class MessageFilter extends BaseUnitGenerator {
  constructor(filterFn) {
    super();
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_FILTER', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.filterFn = filterFn || defaultFilterFn;
  }

  schedule(message) {
    const note = message.getNote() || 60;
    if (!this.filterFn(note)) {
      return;
    }
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(message));
  }

  static fromParams({ filterFn, }) {
    return new MessageFilter(filterFn);
  }
}
