import { SVG_NS, CSS } from './constants';

export default class SvgBaseNode {
  constructor() {
    this.svgContainer = document.createElementNS(SVG_NS, 'g');
    this.svgContainer.classList.add(CSS.NODE_CONTAINER);
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
      this.svgCenter.classList.add(CSS.CIRCLE_ACTIVE) :
      this.svgCenter.classList.remove(CSS.CIRCLE_ACTIVE);
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
