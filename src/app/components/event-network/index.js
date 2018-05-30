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

class EventNetwork extends BaseComponent {

  constructor() {
    super(style, markup);
    this.nodes = [];
    this.inputNodes = [];
    this.getAllNodes = () => this.nodes;
    this.getAllInputNodes = () => [...this.inputNodes, ...this.nodes];
    this.containerMenuIsActive = false;
    this.menuNode = null;
  }

  connectedCallback() {
    this.id = `EventNetwork${instanceCnt++}`;
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    this.svgContainer = this.root.getElementById('svgContainer');
    this.containerMenu = this.root.getElementById('containerMenu');
    this.nodeMenu = this.root.getElementById('nodeMenu');

    this.svgContainer.addEventListener('contextmenu', this.onRightClick.bind(this));
    this.svgContainer.addEventListener('mousedown', event => {
      this.showContainerMenu(false);
      this.openNodeMenu(false);
      this.nodes.forEach(node => node.setActive(false, event.target))
      this.inputNodes.forEach(node => node.setActive(false, event.target))
    });
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
    tickEventBus.unsubscribe(this.tickEventSubscription);
  }

  addNode(event) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.svgContainer);
    const node = new EventNode(coords.x, coords.y, this.svgContainer, this.getAllInputNodes, this.openNodeMenu.bind(this));
    this.nodes.push(node);
    this.showContainerMenu(false);
    this.openNodeMenu(false);
  }

  addInput(event) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.svgContainer);
    const node = new InputNode(coords.x, coords.y, this.svgContainer, this.getAllInputNodes, this.openNodeMenu.bind(this));
    this.inputNodes.push(node);
    this.showContainerMenu(false);
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        this.nodes.forEach(node => node.onBeforeActivate());
        this.inputNodes.forEach(node => node.activate(tickNumber))
      },
      render: (tickNumber, lastTickNumber) => {
        this.inputNodes.forEach(node => node.render(tickNumber));
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
    this.openNodeMenu(false);
  }

  showContainerMenu(isActive, clientX, clientY) {
    if (isActive) {
      const coords = getCoordinatesFromEvent(clientX, clientY, this.svgContainer);
      this.containerMenu.classList.add('menu-active');
      this.containerMenu.style.setProperty('left', `${coords.x * elementScale}px`);
      this.containerMenu.style.setProperty('top', `${coords.y  * elementScale}px`);
    }
    else {
      this.containerMenu.classList.remove('menu-active');
    }
  }

  openNodeMenu(isActive, event, node) {
    if (isActive) {
      const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.svgContainer);
      this.nodeMenu.classList.add('menu-active');
      this.nodeMenu.style.setProperty('left', `${coords.x * elementScale}px`);
      this.nodeMenu.style.setProperty('top', `${coords.y  * elementScale}px`);
      this.menuNode = node;
    }
    else {
      this.nodeMenu.classList.remove('menu-active');
      this.menuNode = null;
    }
  }

  deleteNode(event) {
    if (!this.menuNode) { return; }
    if (this.menuNode instanceof EventNode) {
      this.nodes.forEach(node => node.detachFromNode(this.menuNode));
      this.inputNodes.forEach(node => node.detachFromNode(this.menuNode));
      this.nodes = this.nodes.filter(node => node !== this.menuNode);
    }
    else if (this.menuNode instanceof InputNode) {
      this.menuNode.remove();
      this.inputNodes = this.inputNodes.filter(node => node !== this.menuNode);
    }
    this.menuNode = null;
    this.openNodeMenu(false);
  }

}

export default new Component(COMPONENT_NAME, EventNetwork);
