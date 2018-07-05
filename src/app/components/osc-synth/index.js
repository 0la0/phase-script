import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Synth from 'services/audio/synth';
import WhiteNoise from 'services/audio/whiteNoise';
import { audioEventBus } from 'services/EventBus';

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
    this.whiteNoise = new WhiteNoise();
  }

  connectedCallback() {
    this.audioEventSubscription = {
      address: `SYNTH_${instanceCnt++}`,
      onNext: message => {
        const offTime = message.time.audio + message.duration;
        this.synth.playNote(message.note, this.getOscillators(), message.time.audio, offTime);
        this.whiteNoise.playNote(message.note, this.getNoiseNode(), message.time.audio, offTime);
      }
    };
    audioEventBus.subscribe(this.audioEventSubscription);

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
    this.noiseContainer = this.root.getElementById('noiseContainer');
  }

  disconnectedCallback() {
    audioEventBus.unsubscribe(this.audioEventSubscription);
  }

  onAttackUpdate(value) {
    this.synth.setAttack(value);
    this.whiteNoise.setAttack(value);
    this.output.attack.innerText = value.toFixed(2);
  }

  onReleaseUpdate(value) {
    this.synth.setRelease(value);
    this.whiteNoise.setRelease(value);
    this.output.release.innerText = value.toFixed(2);
  }

  addVoice() {
    const ele = document.createElement('osc-voice');
    this.voiceContainer.appendChild(ele);
  }

  getOscillators() {
    return [...this.voiceContainer.children].map(ele => ele.getOsc());
  }

  getNoiseNode() {
    return [...this.noiseContainer.children].map(ele => ele.getOsc());
  }

  addNoise() {
    const hasNoise = [...this.noiseContainer.children].length;
    if (hasNoise) {
      [...this.noiseContainer.children].forEach(child => this.noiseContainer.removeChild(child));
    }
    else {
      const ele = document.createElement('osc-voice');
      this.noiseContainer.appendChild(ele);
    }
  }
}

export default new Component(COMPONENT_NAME, OscSynth);
