import Component from 'components/_util/component';
import { tickEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import EventNode from 'components/event-network/nodes/EventNode';
import InputNode from 'components/event-network/nodes/InputNode';
import AbstractGraph from 'components/event-network/svg-graph/abstract-graph';
import MetronomeScheduler from 'services/metronome/MetronomeScheduler';

const COMPONENT_NAME = 'event-network';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = [ 'svgContainer', 'containerMenu' ];

class EventNetwork extends AbstractGraph {
  constructor() {
    super(style, markup, dom);
  }

  connectedCallback() {
    super.connectedCallback();
    this.metronomeSchedulable = new MetronomeScheduler({
      processTick: this.handleTick.bind(this),
      render: this.handleTickRender.bind(this)
    });
    metronomeManager.getScheduler().register(this.metronomeSchedulable);
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    tickEventBus.unsubscribe(this.tickEventSubscription);
  }

  addNode(event) {
    super.addNode(event, EventNode);
  }

  addInput(event) {
    super.addInput(event, InputNode);
  }

  handleTick(tickNumber, time) {
    this.nodes.forEach(node => node.onBeforeActivate());
    this.inputNodes.forEach(node => node.activate(tickNumber, time));
  }

  handleTickRender() {
    this.nodes.forEach(node => node.renderActivationState());
  }
}

export default new Component(COMPONENT_NAME, EventNetwork);
