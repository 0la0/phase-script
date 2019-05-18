import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/AudioParameter/UgenConnectionType';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import AudioEventToModelAdapter from 'services/AudioParameter/AudioEventToModelAdapter';
import DiscreteSignalParameter from 'services/AudioParameter/DiscreteSignalParameter';

const normalizeTime = time => time / 1000;

export default class MessageDelay extends BaseUnitGenerator {
  constructor(delayTime) {
    super();
    const defaultDelayTime = this._ifNumberOr(delayTime, 0);
    this.eventModel = new AudioEventToModelAdapter(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MSG_DELAY', this.eventModel, UgenConnectinType.MESSAGE, UgenConnectinType.MESSAGE);
    this.paramMap = {
      delayTime: new DiscreteSignalParameter(defaultDelayTime, normalizeTime),
    };
  }

  schedule(message) {
    setTimeout(() => {
      const delayTime = this.paramMap.delayTime.getValueForTime(message.time);
      const modifiedTime = message.getTime().clone().add(delayTime);
      const modifiedMessage = message.clone().setTime(modifiedTime);
      this.eventModel.getOutlets().forEach(outlet => outlet.schedule(modifiedMessage));
    });
  }

  static fromParams({ delayTime, }) {
    return new MessageDelay(delayTime);
  }
}
