import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';

const COMPONENT_NAME = 'event-address';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  addressInput: 'addressInput',
};
const ADDRESS_INVALID = 'address-invalid';
let instanceCnt = 0;

// TODO: rename to PathAddress
class EventAddress extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.outlets = new Set([]);
    this.audioModel = {
      type: 'ADDRESS',
      connectTo: model => this.outlets.add(model),
      disconnect: model => this.outlets.delete(model),
    };
  }

  connectedCallback() {
    const initialAddress = `event-address${instanceCnt++}`;
    this.dom.addressInput.addEventListener('change', this.handleAddressChange.bind(this));
    this.dom.addressInput.value = initialAddress;
    this.audioEventSubscription = {
      address: initialAddress,
      onNext: message => this.outlets.forEach(outlet => outlet.schedule(message)),
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

  getConnectionFeatures() {
    return {
      input: PATCH_EVENT.EMPTY,
      output: PATCH_EVENT.MESSAGE
    };
  }
}

export default new Component(COMPONENT_NAME, EventAddress);
