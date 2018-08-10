import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { eventBus } from 'services/EventBus';

const COMPONENT_NAME = 'draggable-wrapper';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const domMap = {
  container: 'container',
  topBar: 'topBar',
  inlet: 'inlet',
  outlet: 'outlet'
};
const MOUSE_STATE = {
  DRAGGING: 'DRAGGING',
  OUTLET: 'OUTLET',
};

class DraggableWrapper extends BaseComponent {
  constructor({ id, onConnectionStart, onConnectionEnd, onConnectionMove }) {
    super(style, markup, domMap);
    this.id = id;
    this.onConnectionStart = onConnectionStart;
    this.onConnectionEnd = onConnectionEnd;
    this.onConnectionMove = onConnectionMove;
    // this.isDragging = false;
    this.mouseState = {
      active: undefined,
      xBuffer: 0,
      yBuffer: 0,
    };
  }

  connectedCallback() {
    this.dom.topBar.addEventListener('mousedown', this.handleDragStart.bind(this));
    // this.dom.inlet.addEventListener('mousedown', event => {
    //   console.log('inlet')
    // });

    this.dom.outlet.addEventListener('mousedown', event => {
      event.preventDefault();
      event.stopPropagation();
      const boundingBox = this.dom.outlet.getBoundingClientRect();
      const centerX = boundingBox.left + (boundingBox.width / 2);
      const centerY = boundingBox.top + (boundingBox.height / 2);
      this.mouseState.active = MOUSE_STATE.OUTLET;
      this.onConnectionStart(centerX, centerY);
    });

    eventBus.subscribe({
      address: 'MOUSE_UP',
      onNext: message => {
        if (this.mouseState.active === MOUSE_STATE.OUTLET) {
          this.onConnectionEnd(message.$event);
        }
        this.mouseState.active = undefined;
      },
    });
    eventBus.subscribe({
      address: 'MOUSE_MOVE',
      onNext: message => {
        if (this.mouseState.active === MOUSE_STATE.DRAGGING) {
          this.handleDrag(message.$event);
        }
        else if (this.mouseState.active === MOUSE_STATE.OUTLET) {
          this.onConnectionMove(message.$event);
        }
      }
    });
  }

  disconnectedCallback() {
    // metronomeManager.getScheduler().deregister(this.metronomeSchedulable);
  }

  handleDragStart(event) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseState.active = MOUSE_STATE.DRAGGING;
    const boundingBox = this.dom.topBar.getBoundingClientRect();
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;
    this.mouseState.xBuffer = Math.round(x);
    this.mouseState.yBuffer = Math.round(y);
  }

  handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    const parentDims = this.parentElement.getBoundingClientRect();
    const mouseX = event.clientX - parentDims.left - this.mouseState.xBuffer;
    const mouseY = event.clientY - parentDims.top - this.mouseState.yBuffer;
    this.dom.container.style.setProperty('left', `${mouseX}px`);
    this.dom.container.style.setProperty('top', `${mouseY}px`);
  }
}

export default new Component(COMPONENT_NAME, DraggableWrapper);
