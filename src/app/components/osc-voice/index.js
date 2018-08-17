import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import Osc, { OSCILATORS } from 'services/audio/synth/Osc';

const COMPONENT_NAME = 'osc-voice';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class OscVoice extends BaseComponent {

  constructor() {
    super(style, markup);
    this.osc = {
      type: 'SINE',
      gain: 0.2
    };
    this.outlets = new Set([]);
    this.audioModel = {
      type: 'OSC', // TODO: class and type: event, receiver, audio
      connectTo: model => this.outlets.add(model),
      schedule: message => {
        console.log('schedule osc', message);
        const startTime = message.time.audio;
        const endTime = message.time.audio + message.duration;
        const osc = new Osc(OSCILATORS.SINE);
        const outputs = [...this.outlets].map(outlet => outlet.provideModel());
        console.log(outputs);
        osc.playNote(60, startTime, endTime, outputs);
      },
    };
  }

  connectedCallback() {
    this.output = {
      gain: this.root.getElementById('gainOutput')
    };
    this.gainSlider = this.root.getElementById('gain-slider');
    this.typeSelector = this.root.getElementById('oscTypeComboBox');

    setTimeout(() => {
      this.gainSlider.setValue(this.osc.gain);
    });
  }

  onGainUpdate(value) {
    this.osc.gain = value;
    this.output.gain.innerText = value.toFixed(2);
  }

  getOsc() {
    return this.osc;
  }

  onOscTypeChange(value) {
    this.osc.type = value
  }

  onRemove() {
    this.parentNode.removeChild(this);
  }

  getConnectionFeatures() {
    return {
      hasInput: true,
      hasOutput: true,
    };
  }
}

export default new Component(COMPONENT_NAME, OscVoice);
