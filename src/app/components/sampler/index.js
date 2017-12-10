import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getSampleKeys, getAudioBuffer } from 'services/audio/sampleBank';
import { play } from 'services/audio/sampler';

const COMPONENT_NAME = 'simple-sampler';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const PARAMS = {
  attack: 'attack',
  sustain: 'sustain',
  release: 'release'
};

class Sampler extends BaseComponent {

  constructor() {
    super(style, markup);
    this.sampleKey;
    this.asr = {
      attack: 0.01,
      sustain: 0.1,
      release: 0.01
    };
    this.startOffset = 0;
  }

  connectedCallback() {
    const sampleSelect = this.root.getElementById('sampleSelect');
    const samples = getSampleKeys().map(sampleName => ({
      label: sampleName, value: sampleName
    }));
    sampleSelect.setOptions(samples);

    this.samplerLabel = this.root.getElementById('samplerLabel');
    this.sampleVisualizer = this.root.getElementById('sampleVisualizer');
    this.sampleVisualizer.setStartOffsetCallback(startOffset => this.startOffset = startOffset);

    // --- SLIDERS --- //
    this.output = Object.keys(PARAMS).reduce((output, param) => {
      const element = this.root.getElementById(`${param}Output`);
      return Object.assign(output, { [param]: element });
    }, {});

    this.sliders = Object.keys(PARAMS).reduce((output, param) => {
      const element = this.root.getElementById(`${param}-slider`);
      element.setValue(this.asr[param], true);
      return Object.assign(output, { [param]: element });
    }, {});
  }

  onSampleChange(value) {
    const audioBuffer = getAudioBuffer(value);
    const bufferLength = (audioBuffer.duration * 1000).toFixed(2);
    this.sampleKey = value;
    this.samplerLabel.innerText = `Sample: ${value}, ${bufferLength}ms`;
    this.sampleVisualizer.setAudioBuffer(audioBuffer, this.asr);
  }

  onPlayerClick() {
    play(this.sampleKey, 0, this.startOffset, this.asr);
  }

  schedule(onTime) {
    play(this.sampleKey, onTime, this.startOffset, this.asr);
  }

  onAttackUpdate(value) {
    this.asr.attack = value;
    this.output.attack.innerText = value.toFixed(2);
    this.sampleVisualizer.setAsr(this.asr);
  }

  onSustainUpdate(value) {
    this.asr.sustain = value;
    this.output.sustain.innerText = value.toFixed(2);
    this.sampleVisualizer.setAsr(this.asr);
  }

  onReleaseUpdate(value) {
    this.asr.release = value;
    this.output.release.innerText = value.toFixed(2);
    this.sampleVisualizer.setAsr(this.asr);
  }

}

export default new Component(COMPONENT_NAME, Sampler);
