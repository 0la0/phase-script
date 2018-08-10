import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import DraggableWrapper from './draggable';
import { uuid } from 'components/_util/math';
import {
  SVG_NS,
  SVG_ELEMENT,
  SVG_ATTRIBUTE,
} from 'components/svg-graph/Constants';

class SvgLine {
  constructor(x1, y1, x2, y2, cssClass) {
    const line = document.createElementNS(SVG_NS, SVG_ELEMENT.LINE);
    line.classList.add(cssClass);
    line.addEventListener('dblclick', event => {
      event.preventDefault();
      event.stopPropagation();
      this.remove();
    });
    this.line = line;
    this.setPosition(x1, y1, x2, y2);
  }

  connect(parentElement) {
    this.parentElement = parentElement;
    this.parentElement.appendChild(this.line);
    return this;
  }

  setPosition(x1, y1, x2, y2) {
    this.line.setAttribute(SVG_ATTRIBUTE.X1, x1);
    this.line.setAttribute(SVG_ATTRIBUTE.Y1, y1);
    this.line.setAttribute(SVG_ATTRIBUTE.X2, x2);
    this.line.setAttribute(SVG_ATTRIBUTE.Y2, y2);
    return this;
  }

  setEndPosition(x, y) {
    this.line.setAttribute(SVG_ATTRIBUTE.X2, x);
    this.line.setAttribute(SVG_ATTRIBUTE.Y2, y);
    return this;
  }

  remove() {
    this.parentElement.removeChild(this.line);
  }
}

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
  }

  handleAdd() {
    const svgLine = new SvgLine(0, 0, 0, 0, 'line');
    const id = uuid();
    const onConnectionStart = (centerX, centerY) => {
      const boundingBox = this.dom.container.getBoundingClientRect();
      const x = ((centerX - boundingBox.left) / boundingBox.width) * 100;
      const y = ((centerY - boundingBox.top) / boundingBox.height) * 100;
      svgLine.setPosition(x, y, x, y);
      svgLine.connect(this.dom.svgContainer);
    };
    const onConnectionEnd = (event) => {
      const element = event.path[0];
      if (!element || element.id !== 'inlet') {
        svgLine.remove();
        return;
      }
      const elementBoundingBox = element.getBoundingClientRect();
      const centerX = elementBoundingBox.left + (elementBoundingBox.width / 2);
      const centerY = elementBoundingBox.top + (elementBoundingBox.height / 2);
      const boundingBox = this.dom.container.getBoundingClientRect();
      const x = ((centerX - boundingBox.left) / boundingBox.width) * 100;
      const y = ((centerY - boundingBox.top) / boundingBox.height) * 100;
      svgLine.setEndPosition(x, y);
    };
    const onConnectionMove = event => {
      const boundingBox = this.dom.container.getBoundingClientRect();
      const x = ((event.clientX - boundingBox.left) / boundingBox.width) * 100;
      const y = ((event.clientY - boundingBox.top) / boundingBox.height) * 100;
      svgLine.setEndPosition(x, y);
    };
    const params = { id, onConnectionStart, onConnectionEnd, onConnectionMove };
    const draggable = new DraggableWrapper.element(params);
    draggable.setOnRemoveCallback(() => {
      this.dom.container.removeChild(draggable);
    });
    this.dom.container.appendChild(draggable);
  }
}

export default new Component(COMPONENT_NAME, PatchSpace);
