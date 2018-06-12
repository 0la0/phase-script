const SVG_NS = 'http://www.w3.org/2000/svg';
const CIRCLE_ACTIVE = 'circle-active';

export default class SvgNode {
  constructor() {
    this.svgContainer = document.createElementNS(SVG_NS, 'g');
    this.svgContainer.classList.add('node-container');
  }

  getCenter() {
    return this.svgCenter;
  }

  getOutline() {
    return this.svgOutline;
  }

  isElement(targetElement) {
    return targetElement === this.svgCenter || targetElement === this.svgOutline;
  }

  setActive(isActive) {
    isActive ?
      this.svgCenter.classList.add(CIRCLE_ACTIVE) :
      this.svgCenter.classList.remove(CIRCLE_ACTIVE);
  }

  addToDom(parentElement) {
    this.svgContainer.appendChild(this.svgActivation);
    this.svgContainer.appendChild(this.svgOutline);
    this.svgContainer.appendChild(this.svgCenter);
    parentElement.appendChild(this.svgContainer);
  }

  remove() {
    this.svgContainer.parentElement.removeChild(this.svgContainer);
  }
}

export class SvgCircleNode extends SvgNode {
  constructor(radius) {
    super();
    this.lastRender = false;
    this.svgCenter = document.createElementNS(SVG_NS, 'circle');
    this.svgOutline = document.createElementNS(SVG_NS, 'circle');
    this.svgActivation = document.createElementNS(SVG_NS, 'circle');
    this.svgCenter.setAttribute('r', radius);
    this.svgOutline.setAttribute('r', radius);
    this.svgActivation.setAttribute('r', radius);
    this.svgCenter.classList.add('circle');
    this.svgOutline.classList.add('circle-outline');
    this.svgActivation.classList.add('circle-activation');
  }

  setPosition(x, y) {
    this.svgCenter.setAttribute('cx', x);
    this.svgCenter.setAttribute('cy', y);
    this.svgOutline.setAttribute('cx', x);
    this.svgOutline.setAttribute('cy', y);
    this.svgActivation.setAttribute('cx', x);
    this.svgActivation.setAttribute('cy', y);
  }

  renderActivation(isActivated) {
    if (isActivated && !this.lastRender) {
      this.svgActivation.classList.add('circle-activation-active');
    }
    else {
      this.svgActivation.classList.remove('circle-activation-active');
    }
    this.lastRender = isActivated;
  }
}

export class SvgSquareNode extends SvgNode {
  constructor(size) {
    super();
    this.halfSize = size / 2;
    this.svgCenter = document.createElementNS(SVG_NS, 'rect');
    this.svgOutline = document.createElementNS(SVG_NS, 'rect');
    this.svgActivation = document.createElementNS(SVG_NS, 'rect');
    this.svgCenter.setAttribute('width', size);
    this.svgCenter.setAttribute('height', size);
    this.svgOutline.setAttribute('width', size);
    this.svgOutline.setAttribute('height', size);
    this.svgActivation.setAttribute('width', size);
    this.svgActivation.setAttribute('height', size);
    this.svgCenter.classList.add('circle');
    this.svgOutline.classList.add('circle-outline');
    this.svgActivation.classList.add('circle-activation');
  }

  setPosition(x, y) {
    this.svgCenter.setAttribute('x', x - this.halfSize);
    this.svgCenter.setAttribute('y', y - this.halfSize);
    this.svgOutline.setAttribute('x', x - this.halfSize);
    this.svgOutline.setAttribute('y', y - this.halfSize);
    this.svgActivation.setAttribute('x', x - this.halfSize);
    this.svgActivation.setAttribute('y', y - this.halfSize);
  }

  renderActivation() {
    // this.svgActivation.classList.toggle('circle-activation-active');
  }
}
