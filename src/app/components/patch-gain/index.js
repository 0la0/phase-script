import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Gain from 'services/audio/gain';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'patch-gain';
const style = '';
const markup= '';

const dom = {
  gainSlider: 'gainSlider',
  gainInlet: 'gainInlet',
};

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
      },
      getSignalModel: {
        getAudioModelInput: () => this.gain.gain.gain
      }
    };
    this.gainParam = new PatchParam.element(gainModel);
    this.root.appendChild(this.gainParam);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchGain);
