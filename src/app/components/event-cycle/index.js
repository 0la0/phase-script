import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { IntArray } from 'components/_util/math';
import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import { parser } from './modules/CycleEvaluator';

const COMPONENT_NAME = 'event-cycle';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const REST = '\'';
const CYCLE_INVALID = 'cycle-input--invalid';

const metronome = metronomeManager.getMetronome();
const domMap = {
  cycleLength: 'cycleLength',
  cycleElement: 'cycleElement',
  sendComboBox: 'sendComboBox',
  cycleInput: 'cycleInput',
};

class EventCycle extends BaseComponent {
  constructor(node) {
    super(style, markup, domMap);
    this.cycleLength = 16;
    this.address = '-';
    this.parentCycle = [];
  }

  connectedCallback() {
    this.dom.cycleLength.value = this.cycleLength;
    this.dom.cycleLength.addEventListener('blur', this.handleCycleLengthChange.bind(this));
    this.dom.cycleInput.addEventListener('keydown', event => event.stopPropagation());
    this.dom.cycleInput.addEventListener('keyup', event => this.handleCycleChange(event.target.value));

    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    this.onNewAddress = {
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.dom.sendComboBox.setOptions(optionList));
      }
    };
    audioEventBus.subscribe(this.onNewAddress);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    audioEventBus.unsubscribe(this.onNewAddress);
  }

  handleCycleLengthChange(event) {
    this.cycleLength = parseInt(event.target.value, 10);
  }

  handleSendAddressChange(address) {
    this.address = address;
  }

  scheduleCycleElement(cycleElement, time, tickLength) {
    if (cycleElement === REST) { return; }
    audioEventBus.publish({
      address: this.address,
      time,
      duration: tickLength,
      note: 60,
    })
  }

  evalCycle(tickNumber, time, tickLength, cycle, cycleDuration) {
    const elementDuration = cycleDuration / cycle.length;
    cycle.forEach((element, index, arr) => {
      const timeObj = {
        audio: time.audio + (index * cycleDuration),
        midi: time.midi + (index * cycleDuration), // TODO: incorporate midi time?
      };
      if (Array.isArray(element)) {
        this.evalCycle(tickNumber, timeObj, tickLength, element, elementDuration);
      }
      else {
        this.scheduleCycleElement(element, timeObj, tickLength)
      }
    });
  }

  handleCycleChange(cycleString) {
    const parsedCycles = parser(cycleString);
    if (!parsedCycles.ok) {
      this.dom.cycleInput.classList.add(CYCLE_INVALID);
      return;
    }
    this.dom.cycleInput.classList.remove(CYCLE_INVALID);
    this.parentCycle = parsedCycles.content;
  }

  triggerCycle(tickNumber, time) {
    if (!this.parentCycle || !this.parentCycle.length) { return; }
    const tickLength = metronome.getTickLength();
    const cycleDuration = (tickLength * this.cycleLength) / this.parentCycle.length;
    this.evalCycle(tickNumber, time, tickLength, this.parentCycle, cycleDuration);
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if (tickNumber % this.cycleLength === 0) {
          this.triggerCycle(tickNumber, time);
        }
      },
      render: (tickNumber, lastTickNumber) => {},
      start: () => {},
      stop: () => {}
    };
  }
}

export default new Component(COMPONENT_NAME, EventCycle);
