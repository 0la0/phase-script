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
    this.menuIsActive = false;
  }

  connectedCallback() {
    this.id = `EventNetwork${instanceCnt++}`;
    this.metronomeSchedulable = this.buildMetronomeSchedulable();
    this.tickSchedulable = this.buildTickSchedulable();
    metronomeManager.getScheduler().register(this.metronomeSchedulable);

    this.svgContainer = this.root.getElementById('svgContainer');
    this.menu = this.root.getElementById('menu');

    this.svgContainer.addEventListener('contextmenu', this.onRightClick.bind(this));
    this.svgContainer.addEventListener('mousedown', event => {
      this.showMenu(false);
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
    const node = new EventNode(coords.x, coords.y, this.svgContainer, this.getAllInputNodes, VIEWBOX_SIZE);
    this.nodes.push(node);
    this.showMenu(false);
  }

  addInput(event) {
    const coords = getCoordinatesFromEvent(event.clientX, event.clientY, this.svgContainer);
    const node = new InputNode(coords.x, coords.y, this.svgContainer, this.getAllInputNodes, VIEWBOX_SIZE);
    this.inputNodes.push(node);
    this.showMenu(false);
  }

  buildMetronomeSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        this.inputNodes.forEach(node => node.activate(tickNumber))
      },
      render: (tickNumber, lastTickNumber) => {
        this.inputNodes.forEach(node => node.render(tickNumber))
      },
      start: () => {},
      stop: () => {}
    };
  }

  buildTickSchedulable() {
    let tickCounter = 0;
    return {
      address: this.id,
      onNext: (msg) => {
        this.processTick(tickCounter, msg.time);
        tickCounter++;
      },
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
    this.showMenu(true, event.clientX, event.clientY);
  }

  showMenu(isActive, clientX, clientY) {
    if (isActive) {
      const coords = getCoordinatesFromEvent(clientX, clientY, this.svgContainer);
      this.menu.classList.add('menu-active');
      this.menu.style.setProperty('left', `${coords.x * elementScale}px`);
      this.menu.style.setProperty('top', `${coords.y  * elementScale}px`);
    }
    else {
      this.menu.classList.remove('menu-active');
    }
  }

}

export default new Component(COMPONENT_NAME, EventNetwork);
