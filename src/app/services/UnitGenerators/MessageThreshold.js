import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';

export default class MessageThreshold extends BaseUnitGenerator {
  constructor(threshold) {
    super();
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new UgenConnection('MSG_THRESH', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.MESSAGE);
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
