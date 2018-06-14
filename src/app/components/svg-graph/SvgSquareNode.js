import { SVG_NS, CSS } from './constants';
import SvgBaseNode from './SvgBaseNode';

export default class SvgSquareNode extends SvgBaseNode {
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
    this.svgCenter.classList.add(CSS.CIRCLE);
    this.svgOutline.classList.add(CSS.CIRCLE_OUTLINE);
    this.svgActivation.classList.add(CSS.CIRCLE_ACTIVATION);
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
