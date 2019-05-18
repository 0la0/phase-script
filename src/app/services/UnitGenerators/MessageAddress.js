import BaseUnitGenerator from 'services/UnitGenerators/BaseUnitGenerator';
import UgenConnectinType from 'services/UgenConnection/UgenConnectionType';
import UgenConnection from 'services/UgenConnection/UgenConnection';
import AudioEventToModelAdapter from 'services/UgenConnection/AudioEventToModelAdapter';
import { audioEventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';

export default class MessageAddress extends BaseUnitGenerator {
  constructor(address) {
    super();
    this.eventModel = new AudioEventToModelAdapter();
    this.audioModel = new UgenConnection('MSG_ADDRESS', this.eventModel, UgenConnectinType.EMPTY, UgenConnectinType.MESSAGE);
    this.audioEventSubscription = new Subscription()
      .setAddress(address)
      .setOnNext(message => this.eventModel.getOutlets().forEach(outlet => outlet.schedule(message)));
    audioEventBus.subscribe(this.audioEventSubscription);
  }

  disconnect() {
    super.disconnect();
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  static fromParams({ address, }) {
    return new MessageAddress(address);
  }
}
