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

  constructor() {
    super(style, markup, domMap);
  }

  connectedCallback() {
    this.dom.thresholdInput.addEventListener('blur', this.handleThresholdChange.bind(this));
    this.dom.valueInput.addEventListener('blur', this.handleSendAddressChange.bind(this));
    this.dom.container.addEventListener('click', event => {
      if (event.target !== this.dom.container) { return; }
      this.hide();
    });

    audioEventBus.subscribe({
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.dom.sendComboBox.setOptions(optionList));
      }
    });
  }

  show(node) {
    this.node = node;
    this.dom.thresholdInput.value = node.getActivationThreshold();
    this.dom.valueInput.value = node.getMessageValue();
    this.dom.sendComboBox.setValue(node.getAddress());
    this.dom.container.classList.add('scrim-active');
  }

  hide() {
    this.node = null;
    this.dom.container.classList.remove('scrim-active');
  }

  setEventDelegate(eventDelegate) {
    this.eventDelegate = eventDelegate;
  }

  handleThresholdChange(event) {
    if (!this.node) { return; }
    const val = parseInt(event.target.value, 10);
    const sanatizedVal = Number.isNaN(val) ? 4 : val;
    this.node.setActivationThreshold(sanatizedVal);
  }

  // handleValueChange(event) {
  //   const val = parseInt(event.target.value, 10);
  //   if (!this.node || Number.isNaN(val)) { return; }
  //   this.node.setEventValue(val);
  // }

  getAddress() {
    return this.dom.sendComboBox.getSelectedValue();
  }

  getMessageValue() {
    const val = parseInt(this.dom.valueInput.value, 10);
    return Number.isNaN(val) ? 60 : val;
  }

  handleSendAddressChange() {
    // console.log(this.getAddress(), this.getMessageValue());
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
    if (!this.eventDelegate || !this.eventDelegate.deleteNode) {
      return;
    }
    this.eventDelegate.deleteNode(this.node);
  }
}

export default new Component(COMPONENT_NAME, PropertyMenu);
