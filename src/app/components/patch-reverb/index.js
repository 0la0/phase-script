import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Reverb from 'services/audio/reverb';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'patch-reverb';

class PatchReverb extends BaseComponent {
  constructor() {
    super('', '', {});
    this.reverb = new Reverb();
    this.audioModel = new PatchAudioModel('REVERB', this.reverb, PATCH_EVENT.SIGNAL, PATCH_EVENT.SIGNAL);
  }

  connectedCallback() {
    const attackModel = {
      label: 'Attack',
      defaultValue: 0.5,
      setValue: this.onAttackUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onAttackUpdate(normalValue, message.time.audio);
      },
    };
    const decayModel = {
      label: 'Decay',
      defaultValue: 0.5,
      setValue: this.onDecayUpdate.bind(this),
      setValueFromMessage: message => {
        const normalValue = message.note / 127;
        this.onDecayUpdate(normalValue, message.time.audio);
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
    const attackParam = new PatchParam.element(attackModel);
    const decayParam = new PatchParam.element(decayModel);
    const wetParam = new PatchParam.element(wetModel);
    this.shadowRoot.appendChild(attackParam);
    this.shadowRoot.appendChild(decayParam);
    this.shadowRoot.appendChild(wetParam);
  }

  onAttackUpdate(value, scheduledTime = 0) {
    this.reverb.setAttack(value, scheduledTime);
  }

  onDecayUpdate(value, scheduledTime = 0) {
    this.reverb.setDecay(value, scheduledTime);
  }

  onWetUpdate(value, scheduledTime = 0) {
    this.reverb.setWetLevel(value, scheduledTime);
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }
}

export default new Component(COMPONENT_NAME, PatchReverb);
