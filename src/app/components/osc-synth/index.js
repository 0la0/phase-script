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
    this.oscillators = [{
      type: 'SINE',
      gain: 0.5
    }];
  }

  connectedCallback() {
    // TODO: static implementation of addresses on event bus class
    eventBus.subscribe({
      address: 'SYNTH',
      onNext: message => {
        this.synth.playNote(message.note, this.oscillators, message.onTime, message.offTime);
      }
    });

    this.output = {
      attack: this.root.getElementById('attackOutput'),
      release: this.root.getElementById('releaseOutput')
    };
    this.voiceContainer = this.root.getElementById('voiceContainer');
    this.root.getElementById('addVoice').addEventListener('click', $event => {
      const voice = {
        type: 'SQUARE',
        gain: 0.5
      };
      this.oscillators.push(voice);
      this.addVoice(voice);
    });
    this.oscillators.forEach(osc => this.addVoice(osc));
  }

  onAttackUpdate(value) {
    this.synth.setAttack(value);
    this.output.attack.innerText = value;
  }

  onReleaseUpdate(value) {
    this.synth.setRelease(value);
    this.output.release.innerText = value;
  }

  addVoice(voice) {
    const ele = document.createElement('osc-voice');
    ele.setModel(voice);
    this.voiceContainer.appendChild(ele);
  }

  removeVoice(voice) {}

}

export default new Component(COMPONENT_NAME, OscSynth);
