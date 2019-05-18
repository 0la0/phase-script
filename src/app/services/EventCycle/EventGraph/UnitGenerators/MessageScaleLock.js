import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import AudioEventToModelAdapter from 'services/AudioParameter/AudioEventToModelAdapter';
import ScaleManager from 'services/scale/ScaleManager';

export default class MessageScaleLock extends BaseUnitGenerator {
  constructor(scaleName = 'major', baseNote = 0) {
    super();
    this.scaleName = scaleName;
    this.baseNote = baseNote;
    this.scaleManager = new ScaleManager(scaleName);
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_SCALE_LOCK', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.MESSAGE);
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
