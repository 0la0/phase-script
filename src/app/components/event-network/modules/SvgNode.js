const SVG_NS = 'http://www.w3.org/2000/svg';
const CIRCLE_ACTIVE = 'circle-active';

export default class SvgNode {
  getCenter() {
    return this.svgCenter;
  }

  getOutline() {
    return this.svgOutline;
  }

  isElement(targetElement) {
    return targetElement === this.svgCenter || targetElement === this.svgOutline;
  }

  setActive(isActive, targetElement) {
    isActive ?
      this.svgOutline.classList.add(CIRCLE_ACTIVE) :
      this.svgOutline.classList.remove(CIRCLE_ACTIVE);
  }

  addToDom(parentElement) {
    parentElement.appendChild(this.svgOutline);
    parentElement.appendChild(this.svgCenter);
  }

  remove() {
    this.svgOutline.parentElement.removeChild(this.svgOutline);
    this.svgCenter.parentElement.removeChild(this.svgCenter);
  }

  activate() {

  }
}

export class SvgCircleNode extends SvgNode {
  constructor(radius) {
    super();
    this.svgCenter = document.createElementNS(SVG_NS, 'circle');
    this.svgOutline = document.createElementNS(SVG_NS, 'circle');
    this.svgCenter.setAttribute('r', radius);
    this.svgOutline.setAttribute('r', radius);
    this.svgCenter.classList.add('circle');
    this.svgOutline.classList.add('circle-outline');
  }

  setPosition(x, y) {
    this.svgCenter.setAttribute('cx', x);
    this.svgCenter.setAttribute('cy', y);
    this.svgOutline.setAttribute('cx', x);
    this.svgOutline.setAttribute('cy', y);
  }
}

export class SvgSquareNode extends SvgNode {
  constructor(size) {
    super();
    this.halfSize = size / 2;
    this.svgCenter = document.createElementNS(SVG_NS, 'rect');
    this.svgOutline = document.createElementNS(SVG_NS, 'rect');
    // this.svgActivation = document.createElementNS(SVG_NS, 'rect');
    this.svgCenter.setAttribute('width', size);
    this.svgCenter.setAttribute('height', size);
    this.svgOutline.setAttribute('width', size);
    this.svgOutline.setAttribute('height', size);
    // this.svgActivation.setAttribute('width', size);
    // this.svgActivation.setAttribute('height', size);
    this.svgCenter.classList.add('circle');
    this.svgOutline.classList.add('circle-outline');
    // this.svgActivation.classList.add('circle-activation');
  }

  setPosition(x, y) {
    this.svgCenter.setAttribute('x', x - this.halfSize);
    this.svgCenter.setAttribute('y', y - this.halfSize);
    this.svgOutline.setAttribute('x', x - this.halfSize);
    this.svgOutline.setAttribute('y', y - this.halfSize);
    // this.svgActivation.setAttribute('x', x - this.halfSize);
    // this.svgActivation.setAttribute('y', y - this.halfSize);
  }
}
