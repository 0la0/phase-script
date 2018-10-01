import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import PatchParam from 'components/patch-param';

const COMPONENT_NAME = 'adsr-envelope';

class AdsrEnvelope extends BaseComponent {

  constructor() {
    super('', '', {});
  }

  connectedCallback() {
    const attackModel = {
      label: 'A',
      defaultValue: 0.01,
      setValue: this.onAttackUpdate.bind(this),
      setValueFromMessage: message => {
        console.log('TODO: implement ADSR param');
      },
      showValue: true,
    };
    const sustainModel = {
      label: 'S',
      defaultValue: 0.1,
      setValue: this.onSustainUpdate.bind(this),
      setValueFromMessage: message => {
        console.log('TODO: implement ADSR param');
      },
      showValue: true,
    };
    const releaseModel = {
      label: 'R',
      defaultValue: 0.01,
      setValue: this.onReleaseUpdate.bind(this),
      setValueFromMessage: message => {
        console.log('TODO: implement ADSR param');
      },
      showValue: true,
    };
    const attackParam = new PatchParam.element(attackModel);
    const sustainParam = new PatchParam.element(sustainModel);
    const releaseParam = new PatchParam.element(releaseModel);
    this.root.appendChild(attackParam);
    this.root.appendChild(sustainParam);
    this.root.appendChild(releaseParam);
  }

  setChangeCallback(changeCallback) {
    this.changeCallback = changeCallback;
  }

  onChange(param, value) {
    if (!this.changeCallback) { return; }
    this.changeCallback(param, value);
  }

  onAttackUpdate(value) {
    this.onChange('attack', value);
  }

  onSustainUpdate(value) {
    this.onChange('sustain', value);
  }

  onReleaseUpdate(value) {
    this.onChange('release', value);
  }
}

export default new Component(COMPONENT_NAME, AdsrEnvelope);
