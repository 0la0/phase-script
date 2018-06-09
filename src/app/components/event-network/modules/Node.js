import { eventBus } from 'services/EventBus';
import SvgLine from './SvgLine';
import { SvgCircleNode, SvgSquareNode } from './SvgNode';
import Edge from './Edge';

const NODE_RADIUS = 4;

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
    // TODO ... ugh
    const parentElement = event.target.parentElement.parentElement.parentElement;
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
          .map(node => {
            const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
            return { node, distance };
          })
          .sort((a, b) => a.distance - b.distance);
        const nearestNode = otherNodes[0];

        const isInDroppingDistance = nearestNode && nearestNode.distance <= NODE_RADIUS;
        const edgeDoesNotExist = this.edges.every(edge => edge.getEndNode() !== nearestNode.node);
        if (isInDroppingDistance && edgeDoesNotExist) {
          const isInputToNode = this instanceof InputNode && nearestNode.node instanceof EventNode;
          const isNodeToNode = this instanceof EventNode && nearestNode.node instanceof EventNode;
          if (isInputToNode || isNodeToNode) {
            if (this === nearestNode.node) {
              console.log('TODO: self connection')
            }
            else {
              const edge = new Edge(this, nearestNode.node, this.svgLine, this.removeEdge.bind(this));
              this.addEdge(edge);
            }
          }
          else {
            this.svgLine.destroy();
          }
        }
        else {
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
    this.openMenu(true, event, this);
  });
}

export default class Node {
  constructor(x, y, parentElement, getAllNodes, openMenu) {
    this.x = x;
    this.y = y;
    this.parentElement = parentElement;
    this.getAllNodes = getAllNodes;
    this.openMenu = openMenu;
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

  detachFromNode(node) {
    if (this === node) {
      this.remove();
    }
    else {
      this.edgesToRemove = this.edges.filter(edge => edge.getEndNode() === node);
      this.edges = this.edges.filter(edge => edge.getEndNode() !== node);
      this.edgesToRemove.forEach(edge => edge.remove());
    }
  }

  remove() {
    this.edges.forEach(edge => edge.remove());
    this.svgNode.remove();
  }
}

export class EventNode extends Node {
  constructor(x, y, parentElement, getAllNodes, openMenu) {
    super(x, y, parentElement, getAllNodes, openMenu);
    this.svgNode = new SvgCircleNode(NODE_RADIUS);
    this.init(x, y);
    this.activationThreshold = 4;
    this.activationCnt = 0;
    this.isActivated = false;
  }

  onBeforeActivate() {
    if (!this.isActivated) { return; }
    this.activationCnt = 0;
    this.isActivated = false;
  }

  activate(tickNumber, time) {
    this.activationCnt++;
    if (this.activationCnt === this.activationThreshold) {
      this.edges.map(edge => edge.getEndNode())
        .forEach(outputNode => outputNode.activate(tickNumber, time));
      this.isActivated = true;
      if (this.action) {
        this.action(time);
      }
    }
  }

  renderActivationState() {
    this.svgNode.renderActivation(this.isActivated);
  }

  setAction(action) {
    this.action = action;
  }

  setActivationThreshold(activationThreshold) {
    this.activationThreshold = activationThreshold;
  }
}

export class InputNode extends Node {
  constructor(x, y, parentElement, getAllNodes, openMenu) {
    super(x, y, parentElement, getAllNodes, openMenu);
    this.svgNode = new SvgSquareNode(NODE_RADIUS);
    this.init(x, y);
  }

  activate(tickNumber, time) {
    this.edges.map(edge => edge.getEndNode())
      .forEach(outputNode => outputNode.activate(tickNumber, time));
  }

  render(tickNumber, lastTickNumber) {
    this.svgNode.renderActivation();
  }
}

export { NODE_RADIUS };
