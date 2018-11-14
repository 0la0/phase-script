import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Gain from 'services/audio/gain';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'patch-gain';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = [ 'gainInlet', 'frequencyInlet' ];

class PatchGain extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.gain = new Gain();
    this.audioModel = new PatchAudioModel('GAIN', this.gain, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    const gainModel = {
      defaultValue: 0.8,
      setValue: value => this.gain.setValue(value),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.gain.setValueAtTime(normalValue, message.time.audio);
      }
    };
    this.gainParam = new PatchParam.element(gainModel);
    this.shadowRoot.appendChild(this.gainParam);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }

  // TODO: move inlet properties into a PatchParam
  getInletCenter() {
    const boundingBox = this.dom.frequencyInlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }

  getFrequencyModel() {
    return {
      getAudioModelInput: () => this.gain.gain.gain // haha,
    };
  }
}

export default new Component(COMPONENT_NAME, PatchGain);
