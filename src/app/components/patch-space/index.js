import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import DraggableWrapper from './draggable';
import { uuid } from 'components/_util/math';
import OscVoice from 'components/osc-voice';
import Sampler from 'components/sampler';
import AdsrEnvelope from 'components/adsr';
import EventAddress from 'components/event-address';
import PatchDac from 'components/patch-dac';

const COMPONENT_NAME = 'patch-space';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  container: 'container',
  svgContainer: 'svgContainer'
};

class PatchSpace extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
    this.onRender = this.render.bind(this);
    this.nodes = [];
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

  handleAddSynth() {
    this.addNode(new OscVoice.element());
  }

  handleAddSampler() {
    this.addNode(new Sampler.element());
  }

  handleAddEventAddress() {
    this.addNode(new EventAddress.element());
  }

  handleAddDac() {
    this.addNode(new PatchDac.element());
  }
}

export default new Component(COMPONENT_NAME, PatchSpace);
