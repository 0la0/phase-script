import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import DraggableWrapper from './draggable';
import { uuid } from 'components/_util/math';
import OscVoice from 'components/osc-voice';
import Sampler from 'components/sampler';
import EventAddress from 'components/event-address';
import PatchDac from 'components/patch-dac';
import EqualizerThree from 'components/equalizer-three';
import PatchChorus from 'components/patch-chorus';
import PatchDelay from 'components/patch-delay';
import PatchWaveshaper from 'components/patch-waveshaper';
import PatchReverb from 'components/patch-reverb';
import PatchPulse from 'components/patch-pulse';
import PatchFilter from 'components/patch-filter';
import PatchGain from 'components/patch-gain';
import PatchLfo from 'components/patch-lfo';
import PatchGrain from 'components/patch-grain';

const COMPONENT_NAME = 'patch-space';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const nodeMap = {
  osc: OscVoice,
  sampler: Sampler,
  address: EventAddress,
  dac: PatchDac,
  eq: EqualizerThree,
  chorus: PatchChorus,
  delay: PatchDelay,
  waveshaper: PatchWaveshaper,
  reverb: PatchReverb,
  pulse: PatchPulse,
  filter: PatchFilter,
  gain: PatchGain,
  lfo: PatchLfo,
  grainulator: PatchGrain,
};

const domMap = {
  container: 'container',
  svgContainer: 'svgContainer',
  buttonContainer: 'buttonContainer',
};

class PatchSpace extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
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
        { target: { getAttribute: () => 'grainulator' } },
      ];
      testNodes.forEach(e => this.addPatchElement(e));
    }, 100);
    // this.root.addEventListener('mousedown', e => e.preventDefault());
  }

  render() {
    this.nodes.forEach(node => node.render());
  }

  addNode(component) {
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
