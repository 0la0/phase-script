import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import {dorian, major, aeolian, minorPentatonic, wholeHalfDiminished} from 'services/scale/scales';
import ScaleHelper from 'services/scale/scaleHelper';
import {getBaseNote} from 'services/audioParams';
import provideEventBus from 'services/EventBus/eventBusProvider';

const COMPONENT_NAME = 'synth-note';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const eventBus = provideEventBus();
const scaleHelper = new ScaleHelper(major);

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
          const startTick = Math.round(clampedX * 100);
          this.note.value = noteValue;
          this.ele.style.setProperty('top', `${clampedY * 100}%`);
          const normalVal = this.note.getNormalizedNoteValue(scaleHelper, getBaseNote());
          this.label.innerText = normalVal;
          if (this.note.startTick !== startTick) {
            this.note.startTick = startTick;
            this.ele.style.setProperty('left', `${clampedX * 100}%`);
          }
        }
        else if (isDragRight) {
          const event = message.$event;
          event.preventDefault();
          event.stopPropagation();
          const parentDims = this.parentNode.getBoundingClientRect();
          const leftPosition = this.ele.getBoundingClientRect().left;
          const widthInPixels = event.clientX - leftPosition;
          const widthInPercent = widthInPixels / parentDims.width;
          const clampedY = Math.max(0, Math.min(1, widthInPercent));
          const noteDuration = Math.round(clampedY * 100);
          this.note.duration = noteDuration;
          this.ele.style.setProperty('width', `${clampedY * 100}%`);
        }

      }
    });

  }

  setNote(note) {
    this.note = note;

    const yVal = ((this.note.value - 1) / -2) * 100;
    const y = `${yVal}%`;
    const x = `${this.note.startTick}%`;
    const width = `${this.note.duration}%`;

    this.ele.style.setProperty('left', x);
    this.ele.style.setProperty('top', y);
    this.ele.style.setProperty('width', width);

    const normalVal = this.note.getNormalizedNoteValue(scaleHelper, getBaseNote());
    this.label.innerText = normalVal;
  }

  setValue(value) {}

  setTick(tick) {}

  setDurationInTicks(duration) {}

}

export default new Component(COMPONENT_NAME, SynthNote);
