import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import DraggableWrapper from './draggable';
import { uuid } from 'components/_util/math';

import Sampler from 'components/patch-space/unit-generators/sampler';
import PatchWaveshaper from 'components/patch-space/unit-generators/waveshaper';

import OscVoice from 'components/osc-voice';
import EventAddress from 'components/event-address';
import PatchDac from 'components/patch-dac';
import PatchChorus from 'components/patch-chorus';
import PatchDelay from 'components/patch-delay';
import PatchReverb from 'components/patch-reverb';
import PatchPulse from 'components/patch-pulse';
import PatchFilter from 'components/patch-filter';
import PatchGain from 'components/patch-gain';
import PatchLfo from 'components/patch-lfo';
import PatchGrain from 'components/patch-grain';
import PatchMessageSpread from 'components/patch-message-spread';
import PatchMidiInterface from 'components/patch-midi-interface';
import PatchMessageRepeater from 'components/patch-message-repeater';

const COMPONENT_NAME = 'patch-space';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const nodeMap = {
  osc: OscVoice,
  sampler: Sampler,
  address: EventAddress,
  dac: PatchDac,
  chorus: PatchChorus,
  delay: PatchDelay,
  waveshaper: PatchWaveshaper,
  reverb: PatchReverb,
  pulse: PatchPulse,
  filter: PatchFilter,
  gain: PatchGain,
  lfo: PatchLfo,
  grainulator: PatchGrain,
  messageSpread: PatchMessageSpread,
  midiInterface: PatchMidiInterface,
  messageRepeater: PatchMessageRepeater,
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
