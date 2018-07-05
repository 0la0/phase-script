import Component from 'components/_util/component';
import { audioEventBus, tickEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import EventNode from 'components/event-network/nodes/EventNode';
import InputNode from 'components/event-network/nodes/InputNode';
import AbstractGraph from 'components/svg-graph/abstract-graph';

const COMPONENT_NAME = 'event-network';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

let instanceCnt = 0;

const domMap = {
  svgContainer: 'svgContainer',
  containerMenu: 'containerMenu'
};

class EventNetwork extends AbstractGraph {
  constructor() {
    super(style, markup, domMap);
  }

  connectedCallback() {
    super.connectedCallback();
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
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

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        this.nodes.forEach(node => node.onBeforeActivate());
        this.inputNodes.forEach(node => node.activate(tickNumber, time))
      },
      render: (tickNumber, lastTickNumber) => {
        this.nodes.forEach(node => node.renderActivationState());
      },
      start: () => {},
      stop: () => {}
    };
  }
}

export default new Component(COMPONENT_NAME, EventNetwork);
