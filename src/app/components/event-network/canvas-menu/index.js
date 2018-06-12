import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'canvas-menu';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  container: 'container'
};

class CanvasMenu extends BaseComponent {
  constructor() {
    super(style, markup, domMap);
  }

  setEventDelegate(eventDelegate) {
    this.eventDelegate = eventDelegate;
  }

  show(x, y) {
    this.dom.container.classList.add('canvas-menu-active');
    this.dom.container.style.setProperty('left', `${x}px`);
    this.dom.container.style.setProperty('top', `${y}px`);
  }

  hide() {
    this.dom.container.classList.remove('canvas-menu-active');
  }

  addInput(event) {
    if (!this.eventDelegate || !this.eventDelegate.addInput) {
      return;
    }
    this.eventDelegate.addInput(event);
  }

  addNode(event) {
    if (!this.eventDelegate || !this.eventDelegate.addNode) {
      return;
    }
    this.eventDelegate.addNode(event);
  }
}

export default new Component(COMPONENT_NAME, CanvasMenu);
