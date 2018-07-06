import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
// import { audioEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'event-cycle';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// const metronome = metronomeManager.getMetronome();
const domMap = {
  cycleLength: 'cycleLength',
  cycleElement: 'cycleElement'
};

class EventCycle extends BaseComponent {
  constructor(node) {
    super(style, markup, domMap);
    this.cycleLength = 4;
  }

  connectedCallback() {
    this.dom.cycleLength.addEventListener('blur', this.handleCycleLengthChange.bind(this));

    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  handleCycleLengthChange(event) {
    this.cycleLength = parseInt(event.target.value, 10);
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        if (tickNumber % this.cycleLength === 0) {
          console.log('startCycle', tickNumber);
        }
      },
      render: (tickNumber, lastTickNumber) => {
        if (tickNumber % this.cycleLength === 0) {
          this.dom.cycleElement.classList.add('cycle-element--active');
        }
        else {
          this.dom.cycleElement.classList.remove('cycle-element--active');
        }
      },
      start: () => {},
      stop: () => {}
    };
  }
}

export default new Component(COMPONENT_NAME, EventCycle);
