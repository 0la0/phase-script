import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import AddressMapItem from 'components/event-cycle/address-map-item';

const COMPONENT_NAME = 'address-mapper';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  addressContainer: 'addressContainer',
};

class AddressMapper extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.changeCallback = () => {};
    this.addressMap = {};
  }

  setChangeCallback(changeCallback) {
    this.changeCallback = changeCallback;
  }

  addAddress() {
    this.dom.addressContainer.appendChild(
      new AddressMapItem.element(this.onAddressChange.bind(this)));
  }

  onAddressChange(keyValue) {
    this.addressMap = Object.assign(this.addressMap, keyValue);
    this.changeCallback(this.addressMap);
  }
}

export default new Component(COMPONENT_NAME, AddressMapper);
