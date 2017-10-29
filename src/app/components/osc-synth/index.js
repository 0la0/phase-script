import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Synth from 'components/osc-synth/modules/synth';
import eventBus from 'services/EventBus';

const COMPONENT_NAME = 'osc-synth';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class OscSynth extends BaseComponent {

  constructor() {
    super(style, markup);
    this.synth = new Synth();
  }

  connectedCallback() {
    // TODO: static implementation of addresses on event bus class
    eventBus.subscribe({
      address: 'SYNTH',
      onNext: message => {
        this.synth.playNote(message.note, this.getOscillators(), message.onTime, message.offTime);
      }
    });

    this.output = {
      attack: this.root.getElementById('attackOutput'),
      release: this.root.getElementById('releaseOutput')
    };
    this.voiceContainer = this.root.getElementById('voiceContainer');
    this.root.getElementById('addVoice').addEventListener('click', $event => this.addVoice());
    this.onAttackUpdate(this.synth.getAttack());
    this.onReleaseUpdate(this.synth.getRelease());
  }

  onAttackUpdate(value) {
    this.synth.setAttack(value);
    this.output.attack.innerText = value.toFixed(3);
  }

  onReleaseUpdate(value) {
    this.synth.setRelease(value);
    this.output.release.innerText = value.toFixed(3);
  }

  addVoice() {
    const ele = document.createElement('osc-voice');
    this.voiceContainer.appendChild(ele);
  }

  getOscillators() {
    return [...this.voiceContainer.children].map(ele => ele.getOsc());
  }

}

export default new Component(COMPONENT_NAME, OscSynth);
