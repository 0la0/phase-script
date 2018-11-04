import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';

const COMPONENT_NAME = 'event-address';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const ADDRESS_INVALID = 'address-invalid';
let instanceCnt = 0;

// TODO: rename to PatchAddress
class EventAddress extends BaseComponent {
  constructor(options) {
    super(style, markup, [ 'addressInput' ]);
    this.eventModel = new PatchEventModel();
    this.audioModel = new PatchAudioModel('ADDRESS', this.eventModel, PATCH_EVENT.EMPTY, PATCH_EVENT.MESSAGE);
  }

  connectedCallback() {
    const initialAddress = `event-address${instanceCnt++}`;
    this.dom.addressInput.addEventListener('change', this.handleAddressChange.bind(this));
    this.dom.addressInput.value = initialAddress;
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
    if (!address || audioEventBus.hasAddress(address)) {
      console.log('invalid address:', address);
      this.dom.addressInput.classList.add(ADDRESS_INVALID);
      return;
    }
    this.dom.addressInput.classList.remove(ADDRESS_INVALID);
    this.audioEventSubscription.address = address;
  }
}

export default new Component(COMPONENT_NAME, EventAddress);
