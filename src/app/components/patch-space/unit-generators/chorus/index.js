import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Chorus from 'services/audio/chorus';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'patch-chorus';

class PatchChorus extends BaseComponent {
  constructor() {
    super('', '');
    this.chorus = new Chorus();
    this.audioModel = new PatchAudioModel('CHORUS', this.chorus, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    const feedbackModel = {
      label: 'Fdbck',
      defaultValue: 0.5,
      setValue: this.onFeedbackUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onFeedbackUpdate(normalValue, message.time.audio);
      },
    };
    const frequencyModel = {
      label: 'Freq',
      defaultValue: 0.5,
      setValue: this.onFreqUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onFreqUpdate(normalValue, message.time.audio);
      },
    };
    const depthModel = {
      label: 'Depth',
      defaultValue: 0.5,
      setValue: this.onDepthUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onDepthUpdate(normalValue, message.time.audio);
      },
    };
    const feedbackParam = new PatchParam.element(feedbackModel);
    const frequencyParam = new PatchParam.element(frequencyModel);
    const depthParam = new PatchParam.element(depthModel);
    this.shadowRoot.appendChild(feedbackParam);
    this.shadowRoot.appendChild(frequencyParam);
    this.shadowRoot.appendChild(depthParam);
  }

  onFeedbackUpdate(value, scheduledTime = 0) {
    const feedback = value * 0.5;
    this.chorus.setFeedback(feedback, scheduledTime);
  }

  onFreqUpdate(value, scheduledTime = 0) {
    const frequency = 0.1 + value * 10;
    this.chorus.setFrequency(frequency, scheduledTime);
  }

  onDepthUpdate(value, scheduledTime = 0) {
    const depth = 0.0005 + value * 0.005;
    this.chorus.setDepth(depth, scheduledTime);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchChorus);
