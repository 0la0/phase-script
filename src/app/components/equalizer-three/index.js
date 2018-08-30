import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'equalizer-three';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  hiSlider: 'hiSlider',
  midSlider: 'midSlider',
  loSlider: 'loSlider',
  hiOutput: 'hiOutput',
  midOutput: 'midOutput',
  loOutput: 'loOutput'
};

class EqualizerThree extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.params = {
      hi: 0.5,
      mid: 0.5,
      lo: 0.5
    };
    this.audioModel = {
      type: 'EQ_THREE',
      connectTo: model => console.log('connect', this, 'to', model),
    };
  }

  connectedCallback() {
    setTimeout(() => {
      this.dom.hiSlider.setValue(this.params.hi);
      this.dom.midSlider.setValue(this.params.mid);
      this.dom.loSlider.setValue(this.params.lo);
      this.dom.hiOutput.innerText = this.params.hi;
      this.dom.midOutput.innerText = this.params.mid;
      this.dom.loOutput.innerText = this.params.lo;
    });
  }

  getConnectionFeatures() {
    return {
      hasInput: true,
      hasOutput: true,
    };
  }

  onHiUpdate(value) {
    this.params.hi = value;
    this.dom.hiOutput.innerText = value.toFixed(2);
  }

  onMidUpdate(value) {
    this.params.mid = value;
    this.dom.midOutput.innerText = value.toFixed(2);
  }

  onLoUpdate(value) {
    this.params.lo = value;
    this.dom.loOutput.innerText = value.toFixed(2);
  }

  getConnectionFeatures() {
    return {
      hasInput: true,
      hasOutput: true,
    };
  }
}

export default new Component(COMPONENT_NAME, EqualizerThree);
