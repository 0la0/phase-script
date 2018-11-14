import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import DraggableWrapper from './draggable';
import { uuid } from 'components/_util/math';

import Sampler from 'components/patch-space/unit-generators/sampler';
import PatchWaveshaper from 'components/patch-space/unit-generators/waveshaper';
import PatchReverb from 'components/patch-space/unit-generators/reverb';
import PatchPulse from 'components/patch-space/unit-generators/pulse';
import MidiOutput from 'components/patch-space/unit-generators/midi-output';
import MessageSpread from 'components/patch-space/unit-generators/message-spread';
import MessageRepeater from 'components/patch-space/unit-generators/message-repeater';
import PatchLfo from 'components/patch-space/unit-generators/lfo';
import PatchGrainulator from 'components/patch-space/unit-generators/grainulator';
import PatchGain from 'components/patch-space/unit-generators/gain';
import ResonanceFilter from 'components/patch-space/unit-generators/resonance-filter';
import PatchDelay from 'components/patch-space/unit-generators/delay';
import PatchDac from 'components/patch-space/unit-generators/dac';
import PatchChorus from 'components/patch-space/unit-generators/chorus';
import MessageAddress from 'components/patch-space/unit-generators/message-address';
import EnvelopedOsc from 'components/patch-space/unit-generators/enveloped-osc';

const COMPONENT_NAME = 'patch-space';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const nodeMap = {
  osc: EnvelopedOsc,
  sampler: Sampler,
  address: MessageAddress,
  dac: PatchDac,
  chorus: PatchChorus,
  delay: PatchDelay,
  waveshaper: PatchWaveshaper,
  reverb: PatchReverb,
  pulse: PatchPulse,
  resFilter: ResonanceFilter,
  gain: PatchGain,
  lfo: PatchLfo,
  grainulator: PatchGrainulator,
  messageSpread: MessageSpread,
  midiOut: MidiOutput,
  messageRepeater: MessageRepeater,
};

const dom = [ 'container', 'svgContainer', 'buttonContainer', ];

class PatchSpace extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.onRender = this.render.bind(this);
    this.nodes = [];
  }

  connectedCallback() {
    Object.entries(nodeMap)
      .map(([ name, component ]) => {
        const button = document.createElement('flat-button');
        button.setAttribute('click', 'addPatchElement');
        button.setAttribute('offtext', name);
        button.setAttribute('node-type', name);
        return button;
      })
      .forEach(element => this.dom.buttonContainer.appendChild(element));

    setTimeout(() => {
      const testNodes = [
        { target: { getAttribute: () => 'address' } },
        { target: { getAttribute: () => 'osc' } },
        { target: { getAttribute: () => 'dac' } },
        // { target: { getAttribute: () => 'midiInterface' } },
        // { target: { getAttribute: () => 'grainulator' } },
        { target: { getAttribute: () => 'messageRepeater' } },
      ];
      testNodes.forEach(e => this.addPatchElement(e));
    }, 100);
    // this.shadowRoot.addEventListener('mousedown', e => e.preventDefault());
  }

  render() {
    this.nodes.forEach(node => node.render());
  }

  addNode(component) {
    component.onRender = this.onRender;
    const draggable = new DraggableWrapper.element({
      id: uuid(),
      onRender: this.onRender,
      svgContainer: this.dom.svgContainer,
      component,
    });
    draggable.setOnRemoveCallback(() => this.handleRemove(draggable));
    this.dom.container.appendChild(draggable);
    this.nodes.push(draggable);
  }

  handleRemove(node) {
    this.nodes.forEach(_node => _node.detach(node));
    this.nodes = this.nodes.filter(_node => _node !== node);
    this.dom.container.removeChild(node);
  }

  addPatchElement(event) {
    const nodeType = event && event.target && event.target.getAttribute('node-type');
    if (!nodeType) { return; }
    const clazz = nodeMap[nodeType].element;
    this.addNode(new clazz());
  }
}

export default new Component(COMPONENT_NAME, PatchSpace);
