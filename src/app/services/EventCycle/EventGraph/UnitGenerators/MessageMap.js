import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import { audioEventBus } from 'services/EventBus';

const defaultMapFn = note => note;

export default class MessageMap {
  constructor(mapFn) {
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_MAP', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
    this.mapFn = mapFn || defaultMapFn;
  }

  schedule(message) {
    const originalNote = message.getNote();
    const modifiedNote = this.mapFn(originalNote || 60);
    const modifiedMessage = message.clone().setNote(modifiedNote);
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
  }

  disconnect() {
    this.eventModel.disconnect();
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  static fromParams({ mapFn, }) {
    return new MessageMap(mapFn);
  }
}
