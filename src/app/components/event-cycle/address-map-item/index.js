import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';

const COMPONENT_NAME = 'address-map-item';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  sendComboBox: 'sendComboBox',
  keyInput: 'keyInput'
};

class AddressMapItem extends BaseComponent {
  constructor(onUpdateCallback) {
    super(style, markup, domMap);
    this.onUpdateCallback = onUpdateCallback;
    this.address = '-';
    this.name = '';
  }

  connectedCallback() {
    this.dom.keyInput.addEventListener('blur', event => this.handleNameChange(event.target.value));
    this.onNewAddress = {
      onNewSubscription: addresses => {
        // TODO: put as as static mathod on send combo box
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.dom.sendComboBox.setOptions(optionList));
      }
    };
    audioEventBus.subscribe(this.onNewAddress);
  }

  disconnectedCallback() {
    audioEventBus.unsubscribe(this.onNewAddress);
  }

  onUpdate() {
    if (!this.name) { return; }
    this.onUpdateCallback({ [this.name]: this.address });
  }

  handleSendAddressChange(address) {
    this.address = address;
    this.onUpdate();
  }

  handleNameChange(name) {
    this.name = name;
    this.onUpdate();
  }
}

export default new Component(COMPONENT_NAME, AddressMapItem);
