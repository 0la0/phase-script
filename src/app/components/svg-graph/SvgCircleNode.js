import { SVG_NS, CSS } from './constants';
import SvgBaseNode from './SvgBaseNode';

export default class SvgCircleNode extends SvgBaseNode {
  constructor(radius) {
    super();
    this.lastRender = false;
    this.svgCenter = document.createElementNS(SVG_NS, 'circle');
    this.svgOutline = document.createElementNS(SVG_NS, 'circle');
    this.svgActivation = document.createElementNS(SVG_NS, 'circle');
    this.svgCenter.setAttribute('r', radius);
    this.svgOutline.setAttribute('r', radius);
    this.svgActivation.setAttribute('r', radius);
    this.svgCenter.classList.add(CSS.CIRCLE);
    this.svgOutline.classList.add(CSS.CIRCLE_OUTLINE);
    this.svgActivation.classList.add(CSS.CIRCLE_ACTIVATION);
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
      this.svgActivation.classList.add(CSS.CIRCLE_ACTIVATION_ACTIVE);
    }
    else {
      this.svgActivation.classList.remove(CSS.CIRCLE_ACTIVATION_ACTIVE);
    }
    this.lastRender = isActivated;
  }
}
