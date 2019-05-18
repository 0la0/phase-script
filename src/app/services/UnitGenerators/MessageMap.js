import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';

const defaultMapFn = note => note;

export default class MessageMap extends BaseUnitGenerator {
  constructor(mapFn) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('MSG_MAP', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.MESSAGE);
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
