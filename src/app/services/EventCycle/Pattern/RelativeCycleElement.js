import { floatingPrecision } from 'services/Math';

export default class RelativeCycleElement {
  constructor(element, relativeTime) {
    this.element = element;
    this.time = floatingPrecision(relativeTime, 6);
  }

  getElement() {
    return this.element;
  }

  setElement(element) {
    this.element = element;
    return this;
  }

  getTime() {
    return this.time;
  }

  setTime(time) {
    this.time = time;
    return this;
  }

  clone() {
    const clonedElement = this.element ? this.element.clone() : undefined;
    return new RelativeCycleElement(clonedElement, this.time);
  }
}
