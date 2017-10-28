import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'osc-voice';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class OscVoice extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    this.output = {
      gain: this.root.getElementById('gainOutput')
    };
  }

  setModel(osc) {
    this.osc = osc;
  }

  onGainUpdate(value) {
    this.osc.gain = value;
    this.output.gain.innerText = value;
  }

  setPropertyUpdateCallback(onUpdate) {
    this.onUpdate = onUpdate;
  }

}

export default new Component(COMPONENT_NAME, OscVoice);
