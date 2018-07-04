import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'property-menu';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();
const domMap = {
  container: 'container',
  thresholdInput: 'tresholdInput',
  sendComboBox: 'sendComboBox',
  valueInput: 'valueInput'
};

class PropertyMenu extends BaseComponent {
  constructor(node) {
    super(style, markup, domMap);
    this.node = node;
  }

  connectedCallback() {
    this.dom.thresholdInput.addEventListener('blur', this.handleThresholdChange.bind(this));
    this.dom.valueInput.addEventListener('blur', this.handleSendAddressChange.bind(this));
    this.dom.container.addEventListener('click', event => {
      if (event.target !== this.dom.container) { return; }
      this.hide();
    });

    this.onNewAddress = {
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.dom.sendComboBox.setOptions(optionList));
      }
    };
    audioEventBus.subscribe(this.onNewAddress);
    setTimeout(() => this.show());
  }

  disconnectedCallback() {
    audioEventBus.unsubscribe(this.onNewAddress);
  };

  show() {
    this.dom.thresholdInput.value = this.node.getActivationThreshold();
    this.dom.valueInput.value = this.node.getMessageValue();
    this.dom.sendComboBox.setValue(this.node.getAddress());
    this.dom.container.classList.add('scrim-active');
  }

  hide() {
    this.dom.container.classList.remove('scrim-active');
    setTimeout(() => this.parentElement.removeChild(this), 300);
  }

  handleThresholdChange(event) {
    if (!this.node) { return; }
    const val = parseInt(event.target.value, 10);
    const sanatizedVal = Number.isNaN(val) ? 4 : val;
    this.node.setActivationThreshold(sanatizedVal);
  }

  getAddress() {
    return this.dom.sendComboBox.getSelectedValue();
  }

  getMessageValue() {
    const val = parseInt(this.dom.valueInput.value, 10);
    return Number.isNaN(val) ? 60 : val;
  }

  handleSendAddressChange() {
    if (!this.node) { return; }
    const address = this.getAddress();
    const note = this.getMessageValue();
    const action = time => audioEventBus.publish({
      address,
      note,
      // value: note.velocity,
      time,
      duration: metronome.getTickLength()
    });
    this.node.setAction(action);
    this.node.setAddress(address);
    this.node.setMessageValue(note);
  }

  deleteNode() {
    console.log('TODO: delete', this);
    this.hide();
  }
}

export default new Component(COMPONENT_NAME, PropertyMenu);
