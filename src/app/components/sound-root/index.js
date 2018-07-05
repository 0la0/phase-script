import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

import Sequencer from 'components/sequencer';
import Synth from 'components/osc-synth';
import GrainMaker from 'components/grain-maker';
import Sampler from 'components/sampler';
import TriggerBox from 'components/trigger-box';
import EventNetwork from 'components/event-network';
import EventCycle from 'components/event-cycle';

const COMPONENT_NAME = 'sound-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  sequencerContainer: 'sequencer-container',
  synthContainer: 'synth-container',
  grainContainer: 'grain-container',
  samplerContainer: 'sampler-container',
  triggerContainer: 'trigger-box-container',
  eventNetworkContainer: 'event-network-container',
  eventCycleContainer: 'event-cycle-container'
};

class SoundRoot extends BaseComponent {

  constructor(note) {
    super(style, markup, domMap);
  }

  addElement(parentElement, ComponentClass) {
    const component = new ComponentClass();
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }

  onAddSequencer() {
    this.addElement(this.dom.sequencerContainer, Sequencer.element);
  }

  onAddSynth() {
    this.addElement(this.dom.synthContainer, Synth.element);
  }

  onAddGrain() {
    this.addElement(this.dom.grainContainer, GrainMaker.element);
  }

  onAddSampler() {
    this.addElement(this.dom.samplerContainer, Sampler.element);
  }

  onAddTrigger() {
    this.addElement(this.dom.triggerContainer, TriggerBox.element);
  }

  onAddEventNetwork() {
    this.addElement(this.dom.eventNetworkContainer, EventNetwork.element);
  }

  onAddCycle() {
    this.addElement(this.dom.eventCycleContainer, EventCycle.element);
  }
}

export default new Component(COMPONENT_NAME, SoundRoot);
