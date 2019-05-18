import BaseUnitGenerator from 'services/EventCycle/EventGraph/UnitGenerators/BaseUnitGenerator';
import PATCH_EVENT from 'services/AudioParameter/PatchEvent';
import PatchAudioModel from 'services/AudioParameter/PatchAudioModel';
import PatchEventModel from 'services/AudioParameter/PatchEventModel';
import { audioEventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';

export default class MessageAddress extends BaseUnitGenerator {
  constructor(address) {
    super();
    this.eventModel = new PatchEventModel();
    this.audioModel = new PatchAudioModel('MSG_ADDRESS', this.eventModel, PATCH_EVENT.EMPTY, PATCH_EVENT.MESSAGE);
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
