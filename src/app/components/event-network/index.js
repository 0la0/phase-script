import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { audioEventBus, tickEventBus } from 'services/EventBus';
import metronomeManager from 'services/metronome/metronomeManager';
import { EventNode, InputNode } from './modules/Node';

const COMPONENT_NAME = 'event-network';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();
const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEWBOX_SIZE = 100;
const elementScale = 4;

let instanceCnt = 0;

function getCoordinatesFromEvent(clientX, clientY, parentElement) {
  const parentBoundingBox = parentElement.getBoundingClientRect();
  const normalX = (clientX - parentBoundingBox.left) / parentBoundingBox.width;
  const normalY = (clientY - parentBoundingBox.top) / parentBoundingBox.height;
  return {
    x: normalX * VIEWBOX_SIZE,
    y: normalY * VIEWBOX_SIZE
  };
}

const domMap = {
  svgContainer: 'svgContainer',
  containerMenu: 'containerMenu',
  nodeMenu: 'propertyMenu'
};

class EventNetwork extends BaseComponent {

  constructor() {
    super(style, markup, domMap);
    this.nodes = [];
    this.inputNodes = [];
    this.getAllNodes = () => this.nodes;
    this.getAllInputNodes = () => [...this.inputNodes, ...this.nodes];
    this.menuNode = null;
  }

  connectedCallback() {
    this.id = `EventNetwork${instanceCnt++}`;
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    this.dom.svgContainer.addEventListener('contextmenu', this.onRightClick.bind(this));
    this.dom.svgContainer.addEventListener('mousedown', event => {
      this.showContainerMenu(false);
      this.openPropertyMenu(false);
    });

    setTimeout(() => {
      this.dom.containerMenu.setEventDelegate({
        addNode: this.addNode.bind(this),
        addInput: this.addInput.bind(this)
      });
      this.dom.nodeMenu.setEventDelegate({
        deleteNode: this.deleteNode.bind(this),
      });
    });
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    tickEventBus.unsubscribe(this.tickEventSubscription);
  }

  addNode(event) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.dom.svgContainer);
    const node = new EventNode(coords.x, coords.y, this.dom.svgContainer, this.getAllInputNodes, this.openPropertyMenu.bind(this));
    this.nodes.push(node);
    this.showContainerMenu(false);
    this.openPropertyMenu(false);
  }

  addInput(event) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.dom.svgContainer);
    const node = new InputNode(coords.x, coords.y, this.dom.svgContainer, this.getAllInputNodes, this.openPropertyMenu.bind(this));
    this.inputNodes.push(node);
    this.showContainerMenu(false);
    this.showContainerMenu(false);
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

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }

  onRightClick(event) {
    event.preventDefault();
    this.showContainerMenu(true, event.clientX, event.clientY);
    this.openPropertyMenu(false);
  }

  showContainerMenu(isActive, clientX, clientY) {
    if (isActive) {
      const coords = getCoordinatesFromEvent(clientX, clientY, this.dom.svgContainer);
      const x = coords.x * elementScale;
      const y = coords.y * elementScale;
      this.dom.containerMenu.show(x, y);
    }
    else {
      this.dom.containerMenu.hide();
    }
  }

  openPropertyMenu(isActive, event, node) {
    if (node instanceof EventNode === false) { return; }
    isActive ? this.dom.nodeMenu.show(node) : this.dom.nodeMenu.hide();
  }

  deleteNode(node) {
    if (!node) { return; }
    if (node instanceof EventNode) {
      this.nodes.forEach(_node => _node.detachFromNode(node));
      this.inputNodes.forEach(_node => _node.detachFromNode(node));
      this.nodes = this.nodes.filter(_node => _node !== node);
    }
    else if (node instanceof InputNode) {
      node.remove();
      this.inputNodes = this.inputNodes.filter(_node => _node !== node);
    }
    this.menuNode = null;
    this.openPropertyMenu(false);
  }
}

export default new Component(COMPONENT_NAME, EventNetwork);
