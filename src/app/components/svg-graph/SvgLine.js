import { CSS, SVG_NS, SVG_ELEMENT, SVG_GROUP, SVG_ATTRIBUTE } from './Constants';

export default class SvgLine {
  constructor(x1, y1, x2, y2, parentElement) {
    const line = document.createElementNS(SVG_NS, SVG_ELEMENT.LINE);
    line.setAttribute('marker-end', 'url(#arrow)');
    line.classList.add(CSS.LINE);
    parentElement.getElementById(SVG_GROUP.EDGE).appendChild(line);
    this.line = line;
    this.setPosition(x1, y1, x2, y2);
  }

  setPosition(x1, y1, x2, y2) {
    this.line.setAttribute(SVG_ATTRIBUTE.X1, x1);
    this.line.setAttribute(SVG_ATTRIBUTE.Y1, y1);
    this.line.setAttribute(SVG_ATTRIBUTE.X2, x2);
    this.line.setAttribute(SVG_ATTRIBUTE.Y2, y2);
  }

  setRemoveCallback(onRemove) {
    this.line.addEventListener('dblclick', event => {
      event.preventDefault();
      event.stopPropagation();
      onRemove();
    });
  }

  destroy() {
    this.line.parentElement.removeChild(this.line);
  }
}
