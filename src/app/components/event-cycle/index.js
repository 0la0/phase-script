import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
// import { audioEventBus } from 'services/EventBus';
// import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'event-cycle';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// const metronome = metronomeManager.getMetronome();
const domMap = {
  // container: 'container',
  // thresholdInput: 'tresholdInput',
  // sendComboBox: 'sendComboBox',
  // valueInput: 'valueInput'
};

class EventCycle extends BaseComponent {
  constructor(node) {
    super(style, markup, domMap);
  }

  connectedCallback() {}

  disconnectedCallback() {}
}

export default new Component(COMPONENT_NAME, EventCycle);
