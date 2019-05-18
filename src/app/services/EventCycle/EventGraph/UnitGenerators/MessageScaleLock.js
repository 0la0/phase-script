import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import PatchEventModel from 'services/AudioParameter/PatchEventModel';
import ScaleManager from 'services/scale/ScaleManager';

export default class MessageScaleLock extends BaseUnitGenerator {
  constructor(scaleName = 'major', baseNote = 0) {
    super();
    this.scaleName = scaleName;
    this.baseNote = baseNote;
    this.scaleManager = new ScaleManager(scaleName);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_SCALE_LOCK', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.MESSAGE);
  }

  schedule(message) {
    const note = this.scaleManager.getNearestNote(this.baseNote, message.note || 60);
    const modifiedMessage = message.clone().setNote(note);
    this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
  }

  static fromParams({ scaleName, baseNote, }) {
    return new MessageScaleLock(scaleName, baseNote);
  }
}
