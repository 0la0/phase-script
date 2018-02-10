import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Synth from 'services/audio/synth';
import audioEventBus from 'services/AudioEventBus';

const COMPONENT_NAME = 'osc-synth';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const PARAMS = {
  attack: 'attack',
  release: 'release'
};

let instanceCnt = 0;

class OscSynth extends BaseComponent {

  constructor() {
    super(style, markup);
    this.synth = new Synth();
  }

  connectedCallback() {
    // TODO: static implementation of addresses on event bus class
    audioEventBus.subscribe({
      address: `SYNTH_${instanceCnt++}`,
      onNext: message => {
        this.synth.playNote(message.note, this.getOscillators(), message.onTime, message.offTime);
      }
    });

    this.output = Object.keys(PARAMS).reduce((output, param) => {
      const element = this.root.getElementById(`${param}Output`);
      return Object.assign(output, { [param]: element });
    }, {});

    setTimeout(() => {
      this.sliders = Object.keys(PARAMS).reduce((output, param) => {
        const element = this.root.getElementById(`${param}-slider`);
        element.setValue(this.synth.asr[param], true);
        return Object.assign(output, { [param]: element });
      }, {});
    });

    this.voiceContainer = this.root.getElementById('voiceContainer');
  }

  onAttackUpdate(value) {
    this.synth.setAttack(value);
    this.output.attack.innerText = value.toFixed(2);
  }

  onReleaseUpdate(value) {
    this.synth.setRelease(value);
    this.output.release.innerText = value.toFixed(2);
  }

  addVoice() {
    const ele = document.createElement('osc-voice');
    this.voiceContainer.appendChild(ele);
  }

  getOscillators() {
    return [...this.voiceContainer.children].map(ele => ele.getOsc());
  }

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }

}

export default new Component(COMPONENT_NAME, OscSynth);
