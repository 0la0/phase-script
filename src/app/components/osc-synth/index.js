import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Synth from 'components/osc-synth/modules/synth';
import provideEventBus from 'services/EventBus/eventBusProvider';

const COMPONENT_NAME = 'osc-synth';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class OscSynth extends BaseComponent {

  constructor() {
    super(style, markup);
    this.eventBus = provideEventBus();
  }

  connectedCallback() {
    // TODO: static implementation of addresses on event bus class
    this.eventBus.subscribe({
      address: 'SYNTH',
      onNext: message => {
        const synth = new Synth();
        synth.playNote(message.note, message.onTime, message.offTime);
      }
    });
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

}

export default new Component(COMPONENT_NAME, OscSynth);
