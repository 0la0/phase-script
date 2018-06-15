import { SVG_NS, CSS, SVG_ELEMENT, SVG_ATTRIBUTE } from './Constants';
import SvgBaseNode from './SvgBaseNode';

export default class SvgSquareNode extends SvgBaseNode {
  constructor(size) {
    super();
    this.halfSize = size / 2;
    this.svgCenter = document.createElementNS(SVG_NS, SVG_ELEMENT.RECT);
    this.svgOutline = document.createElementNS(SVG_NS, SVG_ELEMENT.RECT);
    this.svgActivation = document.createElementNS(SVG_NS, SVG_ELEMENT.RECT);
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.WIDTH, size);
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.HEIGHT, size);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.WIDTH, size);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.HEIGHT, size);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.WIDTH, size);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.HEIGHT, size);
    this.svgCenter.classList.add(CSS.CIRCLE);
    this.svgOutline.classList.add(CSS.CIRCLE_OUTLINE);
    this.svgActivation.classList.add(CSS.CIRCLE_ACTIVATION);
  }

  setPosition(x, y) {
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.X, x - this.halfSize);
    this.svgCenter.setAttribute(SVG_ATTRIBUTE.Y, y - this.halfSize);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.X, x - this.halfSize);
    this.svgOutline.setAttribute(SVG_ATTRIBUTE.Y, y - this.halfSize);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.X, x - this.halfSize);
    this.svgActivation.setAttribute(SVG_ATTRIBUTE.Y, y - this.halfSize);
  }

  renderActivation() {
    // this.svgActivation.classList.toggle('circle-activation-active');
  }
}
