import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import eventBus from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'message-filter';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class MessageFilter extends BaseComponent {

  constructor() {
    super(style, markup);
    this.count = 0;

    this.filterSelect = this.root.getElementById('filter-select-box');
    this.setFilterValue();
    this.filterSelect.addEventListener('change', $event => this.setFilterValue());

    this.repeatFrequencySelect = this.root.getElementById('repeat-frequency-select-box');
    this.setRepeatFrequency();
    this.repeatFrequencySelect.addEventListener('change', $event => this.setRepeatFrequency());

    this.repeatSelect = this.root.getElementById('repeat-select-box');
    this.setRepeatValue();
    this.repeatSelect.addEventListener('change', $event => this.setRepeatValue());

    this.repeatModifier = this.root.getElementById('repeat-modifier');
    this.setRepeatModifierValue();
    this.repeatModifier.addEventListener('change', $event => this.setRepeatModifierValue());
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
    this.repeatFrequency = this.repeatFrequencySelect[this.repeatFrequencySelect.selectedIndex].value;
  }

  setRepeatModifierValue() {
    this.repeatModifierValue = this.repeatModifier[this.repeatModifier.selectedIndex].value;
  }

  processMessage(message) {
    if (this.count++ % this.filterValue !== 0) {
      return;
    }
    const numRepeats = parseInt(this.repeatValue);
    const repeatFrequency = parseInt(this.repeatFrequency);
    const repeatModifier = this.repeatModifierValue;
    const tempo = metronomeManager.getMetronome().getTempo();
    const tickLength = metronomeManager.getMetronome().getTickLength();
    const timeOption = message.timeOption;

    const messageList = getMessageList(numRepeats, repeatFrequency, repeatModifier, tempo, tickLength, timeOption);
    messageList.forEach(offset => {
      const time = message.scheduledTime[message.timeOption] + offset;
      message.time = time;
      eventBus.publish(message);
    });
  }

}

function getMessageList(numRepeats, repeatFrequency, repeatModifier, tempo, tickLength, timeOption) {
  const repeatStrategy = {
    linear: () => {
      return new Array(numRepeats).fill(null)
        .map((nullVal, index) => {
          const offset = index * tickLength * repeatFrequency;
          return timeOption === 'midi' ? offset * 1000 : offset;
        });
    },
    'ramp-up': (baseTime) => {
      const offsetList = repeatStrategy['ramp-down'](baseTime);
      const maxValue = Math.max.apply(null, offsetList);
      const reverseList = offsetList.map(offset => maxValue - offset + baseTime);
      return reverseList;
    },
    'ramp-down': (baseTime) => {
      let diff = 4;
      const offsetList = new Array(numRepeats).fill(null)
        .map((nullVal, index, array) => {
          let offset = 0
          if (index !== 0) {
            const lastValue = array[index - 1];
            offset = lastValue + tickLength * repeatFrequency * diff;
            diff /= 2;
          }
          return timeOption === 'midi' ?
            offset * 1000 + baseTime:
            offset + baseTime;
        })
        .sort((a, b) => b - a);
      return offsetList;
    },
    'u-shaped': (baseTime) => {
      const up = repeatStrategy['ramp-up'](baseTime);
      const upEndingTime = Math.max.apply(null, up);
      const down = repeatStrategy['ramp-down'](upEndingTime);
      return up.concat(down);
    },
    'n-shaped': (baseTime) => {
      const down = repeatStrategy['ramp-down'](baseTime);
      const downEndingTime = Math.max.apply(null, down);
      const up = repeatStrategy['ramp-up'](downEndingTime);
      return down.concat(up);
    }
  }
  return repeatStrategy[repeatModifier](0);
}

export default new Component(COMPONENT_NAME, MessageFilter);
