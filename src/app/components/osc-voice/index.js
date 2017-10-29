import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'osc-voice';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class OscVoice extends BaseComponent {

  constructor() {
    super(style, markup);
    this.osc = {
      type: 'SINE',
      gain: 0.2
    };
  }

  connectedCallback() {
    this.output = {
      gain: this.root.getElementById('gainOutput')
    };
    this.typeSelector = this.root.getElementById('oscType');
    this.typeSelector.addEventListener('change', $event => this.osc.type = this.typeSelector.value);
    this.root.getElementById('removeButton')
      .addEventListener('click', $event => this.parentNode.removeChild(this));
    this.onGainUpdate(this.osc.gain);
  }

  onGainUpdate(value) {
    this.osc.gain = value;
    this.output.gain.innerText = value.toFixed(3);
  }

  getOsc() {
    return this.osc;
  }

}

export default new Component(COMPONENT_NAME, OscVoice);
