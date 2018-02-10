import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'sound-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class SoundRoot extends BaseComponent {

  constructor(note) {
    super(style, markup);
  }

  connectedCallback() {
    this.sequencerContainer = this.root.getElementById('sequencer-container');
    this.synthContainer = this.root.getElementById('synth-container');
    this.grainContainer = this.root.getElementById('grain-container');
    this.samplerContainer = this.root.getElementById('sampler-container');
    this.triggerContainer = this.root.getElementById('trigger-box-container');
  }

  onAddSequencer() {
    const sequencer = document.createElement('sequence-driver');
    sequencer.setOnRemoveCallback(() => this.sequencerContainer.removeChild(sequencer));
    this.sequencerContainer.appendChild(sequencer);
  }

  onAddSynth() {
    const synth = document.createElement('osc-synth');
    synth.setOnRemoveCallback(() => this.synthContainer.removeChild(synth));
    this.synthContainer.appendChild(synth);
  }

  onAddGrain() {
    const grainularSampler = document.createElement('grain-maker');
    grainularSampler.setOnRemoveCallback(() => this.grainContainer.removeChild(grainularSampler));
    this.grainContainer.appendChild(grainularSampler);
  }

  onAddSampler() {
    const sampler = document.createElement('simple-sampler');
    sampler.setOnRemoveCallback(() => this.samplerContainer.removeChild(sampler));
    this.samplerContainer.appendChild(sampler);
  }

  onAddTrigger() {
    const trigger = document.createElement('trigger-box');
    trigger.setOnRemoveCallback(() => this.triggerContainer.removeChild(trigger));
    this.triggerContainer.appendChild(trigger);
  }

}

export default new Component(COMPONENT_NAME, SoundRoot);
