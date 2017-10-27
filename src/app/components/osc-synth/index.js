import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Synth from 'components/osc-synth/modules/synth';
import eventBus from 'services/EventBus';

const COMPONENT_NAME = 'osc-synth';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class OscSynth extends BaseComponent {

  constructor() {
    super(style, markup);
    this.synth = new Synth();
  }

  connectedCallback() {
    // TODO: static implementation of addresses on event bus class
    eventBus.subscribe({
      address: 'SYNTH',
      onNext: message => {
        this.synth.playNote(message.note, message.onTime, message.offTime);
      }
    });
  }

  onOsc1GainUpdate(value) {
    console.log('onOsc1GainUpdate...', value);
  }

  onOsc2GainUpdate(value) {
    console.log('onOsc2GainUpdate', value);
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

}

export default new Component(COMPONENT_NAME, OscSynth);
