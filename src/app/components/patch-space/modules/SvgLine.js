import {
  SVG_NS,
  SVG_ELEMENT,
  SVG_ATTRIBUTE,
} from 'components/svg-graph/Constants';

export default class SvgLine {
  constructor(x1, y1, x2, y2, onRemoveCallback) {
    const line = document.createElementNS(SVG_NS, SVG_ELEMENT.LINE);
    line.classList.add('line');
    line.addEventListener('dblclick', event => {
      event.preventDefault();
      event.stopPropagation();
      this.remove();
    });
    this.line = line;
    this.onRemoveCallback = onRemoveCallback;
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
    this.onRemoveCallback(this);
    this.parentElement.removeChild(this.line);
  }
}
