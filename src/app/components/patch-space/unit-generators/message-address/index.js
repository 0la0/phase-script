import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';

const markup = '<text-input id="addressInput" type="text" change="handleAddressChange"></text-input>';
let instanceCnt = 0;

class MessageAddress extends BaseComponent {
  constructor() {
    super('', markup, [ 'addressInput' ]);
    this.eventModel = new PatchEventModel();
    this.audioModel = new PatchAudioModel('ADDRESS', this.eventModel, PATCH_EVENT.EMPTY, PATCH_EVENT.MESSAGE);
  }

  connectedCallback() {
    const initialAddress = `address-${instanceCnt++}`;
    this.dom.addressInput.setAttribute('value', initialAddress);
    this.audioEventSubscription = {
      address: initialAddress,
      onNext: message => this.eventModel.getOutlets().forEach(outlet => outlet.schedule(message)),
    };
    audioEventBus.subscribe(this.audioEventSubscription);
  }

  disconnectedCallback() {
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  handleAddressChange(event) {
    const address = event.target.value;
    this.audioEventSubscription.address = address;
  }
}

export default new Component('message-address', MessageAddress);
