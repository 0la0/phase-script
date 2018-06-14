import { SVG_NS } from './constants';

export default class SvgLine {
  constructor(x1, y1, x2, y2, parentElement) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('marker-end', 'url(#arrow)');
    line.classList.add('line');
    parentElement.getElementById('edgeGroup').appendChild(line);
    this.line = line;
    this.setPosition(x1, y1, x2, y2);
  }

  setPosition(x1, y1, x2, y2) {
    this.line.setAttribute('x1', x1);
    this.line.setAttribute('y1', y1);
    this.line.setAttribute('x2', x2);
    this.line.setAttribute('y2', y2);
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
