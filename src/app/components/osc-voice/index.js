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
    this.gainSlider = this.root.getElementById('gain-slider');
    this.typeSelector = this.root.getElementById('oscTypeComboBox');

    setTimeout(() => {
      this.gainSlider.setValue(this.osc.gain);
    });
  }

  onGainUpdate(value) {
    this.osc.gain = value;
    this.output.gain.innerText = value.toFixed(3);
  }

  getOsc() {
    return this.osc;
  }

  onOscTypeChange(value) {
    this.osc.type = value
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }

}

export default new Component(COMPONENT_NAME, OscVoice);
