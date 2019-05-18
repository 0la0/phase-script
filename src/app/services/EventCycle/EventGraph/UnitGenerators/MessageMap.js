import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import PatchEventModel from 'services/AudioParameter/PatchEventModel';

const defaultMapFn = note => note;

export default class MessageMap extends BaseUnitGenerator {
  constructor(mapFn) {
    super();
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

  static fromParams({ mapFn, }) {
    return new MessageMap(mapFn);
  }
}
