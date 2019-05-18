import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import AudioEventToModelAdapter from 'services/AudioParameter/AudioEventToModelAdapter';

const defaultFilterFn = () => true;

export default class MessageFilter extends BaseUnitGenerator {
  constructor(filterFn) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_FILTER', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.MESSAGE);
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
