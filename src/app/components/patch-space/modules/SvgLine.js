import {
  SVG_NS,
  SVG_ELEMENT,
  SVG_ATTRIBUTE,
} from 'components/svg-graph/Constants';

export default class SvgLine {
  constructor(x1, y1, x2, y2, onRemoveCallback) {
    const group = document.createElementNS(SVG_NS, SVG_ELEMENT.GROUP);
    const line = document.createElementNS(SVG_NS, SVG_ELEMENT.LINE);
    const circle = document.createElementNS(SVG_NS, SVG_ELEMENT.CIRCLE);
    circle.setAttribute(SVG_ATTRIBUTE.R, '0.5');
    group.appendChild(line);
    group.appendChild(circle);
    line.classList.add('line');
    circle.classList.add('circle');
    circle.addEventListener('dblclick', event => {
      event.preventDefault();
      event.stopPropagation();
      this.remove();
    });
    this.group = group;
    this.line = line;
    this.circle = circle;
    this.onRemoveCallback = onRemoveCallback;
    this.position = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this.setPosition(x1, y1, x2, y2);
  }

  connect(parentElement) {
    this.parentElement = parentElement;
    this.parentElement.appendChild(this.group);
    return this;
  }

  setPosition(x1, y1, x2, y2) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    this.position.x1 = x1;
    this.position.y1 = y1;
    this.position.x2 = x2;
    this.position.y2 = y2;
    this.line.setAttribute(SVG_ATTRIBUTE.X1, x1);
    this.line.setAttribute(SVG_ATTRIBUTE.Y1, y1);
    this.line.setAttribute(SVG_ATTRIBUTE.X2, x2);
    this.line.setAttribute(SVG_ATTRIBUTE.Y2, y2);
    this.circle.setAttribute(SVG_ATTRIBUTE.CX, midX);
    this.circle.setAttribute(SVG_ATTRIBUTE.CY, midY);
    return this;
  }

  setEndPosition(x, y) {
    const midX = (this.position.x1 + x) / 2;
    const midY = (this.position.y1 + y) / 2;
    this.position.x2 = x;
    this.position.y2 = y;
    this.line.setAttribute(SVG_ATTRIBUTE.X2, x);
    this.line.setAttribute(SVG_ATTRIBUTE.Y2, y);
    this.circle.setAttribute(SVG_ATTRIBUTE.CX, midX);
    this.circle.setAttribute(SVG_ATTRIBUTE.CY, midY);
    return this;
  }

  remove() {
    this.onRemoveCallback(this);
    this.parentElement.removeChild(this.group);
  }
}
