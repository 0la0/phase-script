import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import scaleHelper from 'services/scale/scaleHelper';
import eventBus from 'services/EventBus';

const COMPONENT_NAME = 'synth-note';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class SynthNote extends BaseComponent {

  constructor(note) {
    super(style, markup);

    this.ele = this.root.getElementById('synth-note');
    this.rightAnchor = this.root.getElementById('right-anchor');
    this.label = this.root.getElementById('label');
  }

  connectedCallback() {
    this.setEventListeners();
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  setEventListeners() {
    let isMoving = false;
    let isDragRight = false;
    let xBuffer = 0;
    let yBuffer = 0;


    this.ele.addEventListener('dblclick', $event => {
      $event.preventDefault();
      $event.stopPropagation();
      this.onRemove(this.note, this);
    });

    this.ele.addEventListener('mousedown', $event => {
      $event.preventDefault();
      $event.stopPropagation();
      isMoving = true;
      isDragRight = false;
      const boundingBox = this.ele.getBoundingClientRect();
      const x = $event.clientX - boundingBox.left;
      const y = $event.clientY - boundingBox.top;
      xBuffer = Math.round(x);
      yBuffer = Math.round(y);
    });

    this.rightAnchor.addEventListener('mousedown', $event => {
      $event.preventDefault();
      $event.stopPropagation();
      isMoving = false;
      isDragRight = true;
    });

    eventBus.subscribe({
      address: 'MOUSE_UP',
      onNext: message => {
        isMoving = false;
        isDragRight = false;
      }
    });

    eventBus.subscribe({
      address: 'MOUSE_MOVE',
      onNext: message => {
        if (isMoving) {
          const event = message.$event;
          event.preventDefault();
          event.stopPropagation();
          const parentDims = this.parentNode.getBoundingClientRect();
          const mouseX = event.clientX - xBuffer;
          const mouseY = event.clientY - yBuffer;
          const percentX = (mouseX - parentDims.left) / parentDims.width;
          const percentY = (mouseY - parentDims.top) / parentDims.height;
          const clampedX = Math.max(0, Math.min(1, percentX));
          const clampedY = Math.max(0, Math.min(1, percentY));
          const noteValue = clampedY * -2 + 1;
          const startTick = Math.round(clampedX * this.totalTicks);

          this.note.value = noteValue;
          this.ele.style.setProperty('top', `${clampedY * 100}%`);
          const normalVal = this.note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());
          this.label.innerText = normalVal;
          if (this.note.startTick !== startTick) {
            const x = (startTick / this.totalTicks) * 100;
            this.note.startTick = startTick;
            this.ele.style.setProperty('left', `${x}%`);
          }
        }
        else if (isDragRight) {
          const event = message.$event;
          event.preventDefault();
          event.stopPropagation();
          const parentDims = this.parentNode.getBoundingClientRect();
          const percentX = (event.clientX - parentDims.left) / parentDims.width;
          const clampedX = Math.max(0, Math.min(1, percentX));
          const dragTick = Math.round(clampedX * this.totalTicks);
          const duration = dragTick - this.note.startTick;
          if (duration > 0 && this.note.duration !== duration) {
            const widthInPercent = duration / this.totalTicks * 100;
            this.note.duration = duration;
            this.ele.style.setProperty('width', `${widthInPercent}%`);
          }

        }

      }
    });

  }

  init(note, totalTicks, onRemove, getBaseNote) {
    this.totalTicks = totalTicks;
    this.note = note;
    this.onRemove = onRemove;
    this.getBaseNote = getBaseNote;

    const startPosition = this.note.startTick / totalTicks * 100;
    const widthInPercent = this.note.duration / totalTicks * 100;
    const yVal = ((this.note.value - 1) / -2) * 100;

    this.ele.style.setProperty('left', `${startPosition}%`);
    this.ele.style.setProperty('top', `${yVal}%`);
    this.ele.style.setProperty('width', `${widthInPercent}%`);

    const normalVal = this.note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());
    this.label.innerText = normalVal;
  }

}

export default new Component(COMPONENT_NAME, SynthNote);
