import { SVG_NS, CSS, SVG_ELEMENT, SVG_ATTRIBUTE } from './Constants';
import SvgBaseNode from './SvgBaseNode';

export default class SvgCircleNode extends SvgBaseNode {
  constructor(radius) {
    super();
    this.lastRender = false;
    this.svgCenter = document.createElementNS(SVG_NS, SVG_ELEMENT.CIRCLE);
    this.svgOutline = document.createElementNS(SVG_NS, SVG_ELEMENT.CIRCLE);
    this.svgActivation = document.createElementNS(SVG_NS, SVG_ELEMENT.CIRCLE);
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.R, radius);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.R, radius);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.R, radius);
    this.svgCenter.classList.add(CSS.CIRCLE);
    this.svgOutline.classList.add(CSS.CIRCLE_OUTLINE);
    this.svgActivation.classList.add(CSS.CIRCLE_ACTIVATION);
  }

  setPosition(x, y) {
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.CX, x);
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.CY, y);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.CX, x);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.CY, y);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.CX, x);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.CY, y);
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
