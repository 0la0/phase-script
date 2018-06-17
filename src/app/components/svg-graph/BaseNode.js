import { eventBus } from 'services/EventBus';
import SvgLine from './SvgLine';
import Edge from './Edge';
import { NODE_RADIUS, SVG_GROUP } from './Constants';
import SvgCircleNode from './SvgCircleNode';
import SvgSquareNode from './SvgSquareNode';

function getSvgNodeFromShape(nodeShape) {
  return nodeShape === 'SQUARE' ?
    new SvgSquareNode(NODE_RADIUS) :
    new SvgCircleNode(NODE_RADIUS);
}

function isEventNode(obj) {
  return obj.constructor.name === 'EventNode';
}

function isInputNode(obj) {
  return obj.constructor.name === 'InputNode';
}

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
          // TODO: put in subclass
          const isInputToNode = isInputNode(this) && isEventNode(nearestNode.node);
          const isNodeToNode = isEventNode(this) && isEventNode(nearestNode.node);
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

export default class BaseNode {
  constructor(x, y, nodeShape, parentElement, getAllNodes, openMenu) {
    this.x = x;
    this.y = y;
    this.svgNode = getSvgNodeFromShape(nodeShape);
    this.parentElement = parentElement;
    this.getAllNodes = getAllNodes;
    this.openMenu = openMenu;
    this.edges = [];
    this._isActive = false;
    this.isDragging = false;
    this.outlineIsActive = false;
    this.setPosition(x, y);
    applyEventListeners.call(this);
    this.svgNode.addToDom(this.parentElement.getElementById(SVG_GROUP.NODE));
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
