import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import EqThree from 'services/audio/eqThree';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';

const COMPONENT_NAME = 'equalizer-three';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  hiSlider: 'hiSlider',
  midSlider: 'midSlider',
  loSlider: 'loSlider',
  hiOutput: 'hiOutput',
  midOutput: 'midOutput',
  loOutput: 'loOutput',
  hiFreqOutput: 'hiFreqOutput',
  loFreqOutput: 'loFreqOutput',
  midFreqOutput: 'midFreqOutput',
  midQOutput: 'midQOutput',
};

const FREQUENCY = {
  MIN: 40,
  MAX: 22050,
};
function mapNormalToFrequency(normal) {
  const range = FREQUENCY.MAX - FREQUENCY.MIN;
  return FREQUENCY.MIN + normal * range;
}

function mapNormalToGain(normal) {
  return -20 + normal * 40;
}

class EqualizerThree extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.params = {
      hi: 0.5,
      mid: 0.5,
      lo: 0.5
    };
    this.eq = new EqThree();
    this.audioModel = new PatchAudioModel('EQ_THREE', this.eq, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
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

  disconnectedCallback() {
    this.eq.disconnect();
  }

  onHiUpdate(value) {
    this.params.hi = value;
    this.eq.setHiGain(mapNormalToGain(value));
    this.dom.hiOutput.innerText = value.toFixed(2);
  }

  onHiFreqUpdate(value) {
    this.params.hiFreq = value;
    this.eq.setHighFrequency(mapNormalToFrequency(value));
    this.dom.hiFreqOutput.innerText = value.toFixed(2);
  }

  onMidUpdate(value) {
    this.params.mid = value;
    this.eq.setMidGain(mapNormalToGain(value));
    this.dom.midOutput.innerText = value.toFixed(2);
  }

  onMidFreqUpdate(value) {
    this.params.midFreq = value;
    this.eq.setMidFrequency(mapNormalToFrequency(value));
    this.dom.midFreqOutput.innerText = value.toFixed(2);
  }

  onMidQUpdate(value) {
    this.params.midQ = value;
    this.eq.setMidQ(value);
    this.dom.midQOutput.innerText = value.toFixed(2);
  }

  onLoUpdate(value) {
    this.params.lo = value;
    this.eq.setLowGain(mapNormalToGain(value));
    this.dom.loOutput.innerText = value.toFixed(2);
  }

  onLoFreqUpdate(value) {
    this.params.loFreq = value;
    this.eq.setLowFrequency(mapNormalToFrequency(value));
    this.dom.loFreqOutput.innerText = value.toFixed(2);
  }
}

export default new Component(COMPONENT_NAME, EqualizerThree);
