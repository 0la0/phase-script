import { eventBus } from 'services/EventBus';
import SvgLine from './SvgLine';
import { SvgCircleNode, SvgSquareNode } from './SvgNode';
import Edge from './Edge';

const RADIUS = 6;

function getSvgCoordinatesFromEvent(event, parentElement) {
  const parentBoundingBox = parentElement.getBoundingClientRect();
  const normalX = (event.clientX - parentBoundingBox.left) / parentBoundingBox.width;
  const normalY = (event.clientY - parentBoundingBox.top) / parentBoundingBox.height;
  return {
    x: normalX * 100,
    y: normalY * 100
  };
}

function applyEventListeners() {
  this.svgNode.getCenter().addEventListener('mousedown', event => {
    event.preventDefault();
    if (!this._isActive) {
      this.setActive(true);
    }
    this.isDragging = true;
  });

  this.svgNode.getOutline().addEventListener('mousedown', event => {
    this.outlineIsActive = true;
    const parentElement = event.target.parentElement.parentElement;
    const coords = getSvgCoordinatesFromEvent(event, parentElement);
    this.svgLine = new SvgLine(this.x, this.y, coords.x, coords.y, parentElement);
  });

  eventBus.subscribe({
    address: 'MOUSE_MOVE',
    onNext: message => {
      if (this.outlineIsActive) {
        const event = message.$event;
        const {x, y} = getSvgCoordinatesFromEvent(event, this.parentElement);
        this.svgLine.setPosition(this.x, this.y, x, y);
      }
      else if (this.isDragging) {
        const event = message.$event;
        event.preventDefault();
        const parentElement = event.target.parentElement.parentElement;
        const {x, y} = getSvgCoordinatesFromEvent(event, this.parentElement);
        this.setPosition(x, y);
      }
    }
  });

  eventBus.subscribe({
    address: 'MOUSE_UP',
    onNext: message => {
      if (this.outlineIsActive) {
        const event = message.$event;
        const {x, y} = getSvgCoordinatesFromEvent(event, this.parentElement);
        const otherNodes = this.getAllNodes()
          .filter(node => node !== this)
          .map(node => {
            const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
            return { node, distance };
          })
          .sort((a, b) => a.distance - b.distance);
        const nearestNode = otherNodes[0];

        const isInDroppingDistance = nearestNode && nearestNode.distance <= RADIUS;
        const edgeDoesNotExist = this.edges.every(edge => edge.getEndNode() !== nearestNode.node);
        const isInputToNode = this instanceof InputNode && nearestNode.node instanceof EventNode;
        const isNodeToNode = this instanceof EventNode && nearestNode.node instanceof EventNode;
        if (isInDroppingDistance && edgeDoesNotExist && (isInputToNode || isNodeToNode)) {
          const edge = new Edge(this, nearestNode.node, this.svgLine, this.removeEdge.bind(this));
          this.addEdge(edge);
        }
        else {
          console.log('destroyLine')
          this.svgLine.destroy();
        }
      }
      this.isDragging = false;
      this.outlineIsActive = false;
    }
  });

  this.svgNode.getCenter().addEventListener('contextmenu', event => {
    event.preventDefault();
    event.stopPropagation();
    console.log('right click on node', event.target);
  });
}

export default class Node {
  constructor(x, y, parentElement, getAllNodes) {
    this.x = x;
    this.y = y;
    this.parentElement = parentElement;
    this.getAllNodes = getAllNodes;
    this.edges = [];
    this._isActive = false;
    this.isDragging = false;
    this.outlineIsActive = false;
  }

  init(x, y) {
    this.setPosition(x, y);
    applyEventListeners.call(this);
    this.svgNode.addToDom(this.parentElement.getElementById('nodeGroup'));
  }

  setPosition(x, y) {
    this.x = Math.max(0, Math.min(100, x));
    this.y = Math.max(0, Math.min(100, y));
    this.svgNode.setPosition(this.x, this.y);
    this.renderAllEdges();
  }

  addEdge(edge) {
    this.edges.push(edge);
    this.renderAllEdges();
  }

  removeEdge(edge) {
    this.edges = this.edges.filter(e => e !== edge);
  }

  getEdges() {
    return this.edges;
  }

  renderAllEdges() {
    this.getAllNodes().forEach(node => node.getEdges().forEach(edge => edge.render()));
  }

  setActive(isActive, targetElement) {
    if (this.svgNode.isElement(targetElement)) { return; }
    this._isActive = isActive;
    this.svgNode.setActive(isActive);
  }

  isActive() {
    return this._isActive;
  }
}

export class EventNode extends Node {
  constructor(x, y, parentElement, getAllNodes) {
    super(x, y, parentElement, getAllNodes);
    this.svgNode = new SvgCircleNode(RADIUS);
    this.init(x, y);
  }
}

export class InputNode extends Node {
  constructor(x, y, parentElement, getAllNodes) {
    super(x, y, parentElement, getAllNodes);
    this.svgNode = new SvgSquareNode(RADIUS);
    this.init(x, y);
  }
}
