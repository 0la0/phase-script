import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import { audioEventBus } from 'services/EventBus';

const defaultFilterFn = () => true;

export default class MessageFilter {
  constructor(filterFn) {
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

  disconnect() {
    this.eventModel.disconnect();
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  static fromParams({ filterFn, }) {
    return new MessageFilter(filterFn);
  }
}
