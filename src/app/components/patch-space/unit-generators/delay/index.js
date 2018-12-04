import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Delay from 'services/audio/delay';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'patch-delay';

class PatchDelay extends BaseComponent {

  constructor() {
    super('', '');
    this.delay = new Delay();
    this.audioModel = new PatchAudioModel('DELAY', this.delay, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    const delayModel = {
      label: 'Delay',
      defaultValue: 0.5,
      setValue: this.onDelayUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onDelayUpdate(normalValue, message.time.audio);
      },
    };
    const feedbackModel = {
      label: 'Fdbck',
      defaultValue: 0.5,
      setValue: this.onFeedbackUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onFeedbackUpdate(normalValue, message.time.audio);
      },
    };
    const wetModel = {
      label: 'Wet',
      defaultValue: 0.5,
      setValue: this.onWetUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onWetUpdate(normalValue, message.time.audio);
      },
    };
    const delayParam = new PatchParam.element(delayModel);
    const feedbackParam = new PatchParam.element(feedbackModel);
    const wetParam = new PatchParam.element(wetModel);
    this.shadowRoot.appendChild(delayParam);
    this.shadowRoot.appendChild(feedbackParam);
    this.shadowRoot.appendChild(wetParam);
  }

  // TODO: Quatization
  onDelayUpdate(value, scheduledTime = 0) {
    this.delay.setDelayTime(value * 0.25, scheduledTime);
  }

  onFeedbackUpdate(value, scheduledTime = 0) {
    this.delay.setFeedback(value, scheduledTime);
  }

  onWetUpdate(value, scheduledTime = 0) {
    this.delay.setWetLevel(value, scheduledTime);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchDelay);
