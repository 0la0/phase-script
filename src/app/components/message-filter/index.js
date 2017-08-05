import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import provideEventBus from 'services/EventBus/eventBusProvider';
import metronomeManager from 'services/metronome/metronomeManager';


const COMPONENT_NAME = 'message-filter';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const eventBus = provideEventBus();

class MessageFilter extends BaseComponent {

  constructor() {
    super(style, markup);
    this.count = 0;

    this.filterSelect = this.root.getElementById('filter-select-box');
    this.setFilterValue();
    this.filterSelect.addEventListener('change', $event => this.setFilterValue());

    this.repeatSelect = this.root.getElementById('repeat-frequency-select-box');
    this.setRepeatValue();
    this.repeatSelect.addEventListener('change', $event => this.setRepeatValue());

    this.repeatSelect = this.root.getElementById('repeat-frequency-select-box');
    this.setRepeatFrequency();
    this.repeatSelect.addEventListener('change', $event => this.setRepeatFrequency());
  }

  connectedCallback() {}

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  setFilterValue() {
    this.filterValue = this.filterSelect[this.filterSelect.selectedIndex].value;
  }

  setRepeatValue() {
    this.repeatValue = this.repeatSelect[this.repeatSelect.selectedIndex].value;
  }

  setRepeatFrequency() {
    this.repeatFrequency = this.repeatSelect[this.repeatSelect.selectedIndex].value;
  }

  processMessage(message) {
    if (this.count++ % this.filterValue !== 0) {
      return;
    }
    const tempo = metronomeManager.getMetronome().getTempo();
    const tickLength = metronomeManager.getMetronome().getTickLength();

    for (let i = 0; i < this.repeatValue; i++) {
      const offset = message.timeOption === 'midi' ?
        // i * tickLength * this.repeatFrequency * 1000 :
        // i * tickLength * this.repeatFrequency;
        i * tickLength * 1000 :
        i * tickLength;

      const time = message.scheduledTime[message.timeOption] + offset;
      message.time = time;
      eventBus.publish(message);
    }

  }

}

export default new Component(COMPONENT_NAME, MessageFilter);
