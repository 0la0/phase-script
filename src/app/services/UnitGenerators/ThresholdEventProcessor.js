import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import ThresholdEventProcessor from 'services/audio/ThresholdEvent';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEvent from 'services/EventBus/AudioEvent';
import TimeSchedule from 'services/metronome/TimeSchedule';
import { audioEventBus } from 'services/EventBus';

export default class PatchThresholdEvent extends BaseUnitGenerator {
  constructor(threshold, address) {
    super();
    this.address = address;
    this.thresholdEventProcessor = new ThresholdEventProcessor(threshold, this.handleEvent.bind(this));
    this.audioModel = new UgenConnection('THRESHOLD_EVENT_PROCESSOR', this.thresholdEventProcessor, UgenConnectinType.SIGNAL, UgenConnectinType.SIGNAL);
  }

  updateParams({ threshold, address }, time) {
    this.address = address;
    this.thresholdEventProcessor.setThresholdAtTime(threshold, time.audio);
  }

  handleEvent() {
    audioEventBus.publish(new AudioEvent(this.address, undefined, new TimeSchedule(), false));
  }

  static fromParams({ threshold, address }) {
    return new PatchThresholdEvent(threshold, address);
  }
}
