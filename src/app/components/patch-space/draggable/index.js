import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { eventBus } from 'services/EventBus';
import SvgLine from '../modules/SvgLine';

const COMPONENT_NAME = 'draggable-wrapper';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  container: 'container',
  topBar: 'topBar',
  inlet: 'inlet',
  outlet: 'outlet',
  body: 'body',
  closeButton: 'closeButton',
  minimizeButton: 'minimizeButton',
};
const MOUSE_STATE = {
  DRAGGING: 'DRAGGING',
  OUTLET: 'OUTLET',
};

class DraggableWrapper extends BaseComponent {
  constructor({ id, svgContainer, onRender, component }) {
    super(style, markup, domMap);
    this.id = id;
    this.svgContainer = svgContainer;
    this.onRender = onRender;
    this.edges = [];
    this.mouseState = {
      active: undefined,
      xBuffer: 0,
      yBuffer: 0,
    };
    this.isMinimized = false;
    this.component = component;
    this.svgLine;
    this.dom.body.appendChild(component);
  }

  connectedCallback() {
    this.dom.topBar.addEventListener('mousedown', this.handleDragStart.bind(this));
    this.dom.outlet.addEventListener('mousedown', this.handleConnectionStart.bind(this));
    this.dom.closeButton.addEventListener('click', this.handleRemove.bind(this));
    this.dom.minimizeButton.addEventListener('click', this.handleMinimize.bind(this));
    eventBus.subscribe({
      address: 'MOUSE_UP',
      onNext: message => {
        if (this.mouseState.active === MOUSE_STATE.OUTLET) {
          this.handleConnectionEnd(message.$event);
        }
        this.mouseState.active = undefined;
      }
    });
    eventBus.subscribe({
      address: 'MOUSE_MOVE',
      onNext: message => {
        if (this.mouseState.active === MOUSE_STATE.DRAGGING) {
          this.handleDrag(message.$event);
        }
        else if (this.mouseState.active === MOUSE_STATE.OUTLET) {
          this.handleConnectionMove(message.$event);
        }
      }
    });

    const parentDims = this.parentElement.getBoundingClientRect();
    this.setPosition(
      parentDims.width / 4 + Math.floor((parentDims.width / 2) * Math.random()),
      parentDims.height / 4 + Math.floor((parentDims.height / 2) * Math.random()),
    );

    if (!this.getComponent().audioModel.getInputType()) {
      this.dom.container.removeChild(this.dom.inlet);
    }
    if (!this.getComponent().audioModel.getOutputType()) {
      this.dom.container.removeChild(this.dom.outlet);
    }
  }

  handleConnectionStart(event) {
    event.preventDefault();
    event.stopPropagation();
    const outletCenter = this.getOutletCenter();
    const boundingBox = this.parentElement.getBoundingClientRect();
    const x = ((outletCenter.x - boundingBox.left) / boundingBox.width) * 100;
    const y = ((outletCenter.y - boundingBox.top) / boundingBox.height) * 100;
    this.svgLine = new SvgLine(0, 0, 0, 0, this.handleRemoveConnection.bind(this));
    this.svgLine.setPosition(x, y, x, y);
    this.svgLine.connect(this.svgContainer);
    this.mouseState.active = MOUSE_STATE.OUTLET;
  }

  handleConnectionMove(event) {
    const boundingBox = this.parentElement.getBoundingClientRect();
    const x = ((event.clientX - boundingBox.left) / boundingBox.width) * 100;
    const y = ((event.clientY - boundingBox.top) / boundingBox.height) * 100;
    this.svgLine.setEndPosition(x, y);
  }

  handleConnectionEnd(event) {
    const element = event.path[0];
    if (!element || element.id !== 'inlet') {
      this.svgLine.remove();
      this.svgLine = undefined;
      return;
    }
    const outgoingNode = element.parentNode.parentNode.host;
    if (outgoingNode === this) {
      this.svgLine.remove();
      this.svgLine = undefined;
      return;
    }
    if (this.edges.some(edge => edge.node === outgoingNode)) {
      this.svgLine.remove();
      this.svgLine = undefined;
      return;
    }
    if (this.getComponent().audioModel.getOutputType() !== outgoingNode.getComponent().audioModel.getInputType()) {
      this.svgLine.remove();
      return;
    }
    const inletCenter = outgoingNode.getInletCenter();
    const boundingBox = this.parentElement.getBoundingClientRect();
    const x = ((inletCenter.x - boundingBox.left) / boundingBox.width) * 100;
    const y = ((inletCenter.y - boundingBox.top) / boundingBox.height) * 100;
    this.svgLine.setEndPosition(x, y);
    this.getComponent().audioModel.connectTo(outgoingNode.getComponent().audioModel);
    this.edges.push({
      svgLine: this.svgLine,
      node: outgoingNode,
    });
  }

  handleDragStart(event) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseState.active = MOUSE_STATE.DRAGGING;
    const boundingBox = this.dom.topBar.getBoundingClientRect();
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;
    this.mouseState.xBuffer = Math.round(x);
    this.mouseState.yBuffer = Math.round(y);
  }

  handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    const parentDims = this.parentElement.getBoundingClientRect();
    const x = event.clientX - parentDims.left - this.mouseState.xBuffer;
    const y = event.clientY - parentDims.top - this.mouseState.yBuffer;
    this.setPosition(x, y)
    this.onRender();
  }

  getInletCenter() {
    const boundingBox = this.dom.inlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }

  handleRemoveConnection(svgLine) {
    const lineNodePair = this.edges.find(edge => edge.svgLine === svgLine);
    this.edges = this.edges.filter(edge => edge.svgLine !== svgLine);
    if (lineNodePair) {
      this.getComponent().audioModel.disconnect(lineNodePair.node.getComponent().audioModel);
    }
  }

  getOutletCenter() {
    const boundingBox = this.dom.outlet.getBoundingClientRect();
    return {
      x: boundingBox.left + (boundingBox.width / 2),
      y: boundingBox.top + (boundingBox.height / 2),
    };
  }

  render() {
    if (!this.edges.length) { return; }
    const boundingBox = this.parentElement.getBoundingClientRect();
    const outletCenter = this.getOutletCenter();
    const startX = ((outletCenter.x - boundingBox.left) / boundingBox.width) * 100;
    const startY = ((outletCenter.y - boundingBox.top) / boundingBox.height) * 100;
    this.edges.forEach(({ svgLine, node }) => {
      const inletCenter = node.getInletCenter();
      const endX = ((inletCenter.x - boundingBox.left) / boundingBox.width) * 100;
      const endY = ((inletCenter.y - boundingBox.top) / boundingBox.height) * 100;
      svgLine.setPosition(startX, startY, endX, endY);
    });
  }

  detach(node) {
    if (node === this) {
      this.edges.forEach(edge => edge.svgLine.remove());
      return;
    }
    const edge = this.edges.find(edge => edge.node === node);
    if (!edge) { return; }
    edge.svgLine.remove();
    this.edges = this.edges.filter(_edge => _edge !== edge);
  }

  setPosition(x, y) {
    this.dom.container.style.setProperty('left', `${x}px`);
    this.dom.container.style.setProperty('top', `${y}px`);
  }

  getComponent() {
    return this.component;
  }

  handleRemove(event) {
    console.log('TODO: resource cleanup');
    this.onRemove();
  }

  handleMinimize(event) {
    this.isMinimized = !this.isMinimized;
    this.isMinimized ?
      this.dom.body.classList.add('body-minimized') :
      this.dom.body.classList.remove('body-minimized');
    this.onRender();
  }
}

export default new Component(COMPONENT_NAME, DraggableWrapper);
