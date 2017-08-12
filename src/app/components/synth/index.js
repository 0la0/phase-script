import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import {dorian, major, aeolian, minorPentatonic, wholeHalfDiminished} from 'services/scale/scales';
import ScaleHelper from 'services/scale/scaleHelper';
import provideEventBus from 'services/EventBus/eventBusProvider';
import NoteSequence from './modules/noteSequence';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'synth-driver';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();

const eventBus = provideEventBus();
let baseNote = 60;
const STEP_LENGTH = 64;
let index = 0;

const noteSequence = new NoteSequence();
const scaleHelper = new ScaleHelper(major);


const keyPress = {
  38: () => baseNote++,
  40: () => baseNote--
};

window.onkeyup = event => {
  const keyStrategy = keyPress[event.keyCode];
  keyStrategy && keyStrategy();
};


// Assume that 1 tick is 1% width
function buildNoteVisualization(parentElement, noteSequence) {
  const noteList = Array.from(noteSequence.sequence);

  noteList.map(note => {
    const yVal = ((note.value - 1) / -2) * 100;
    const y = `${yVal}%`;
    const x = `${note.startTick}%`;
    const width = `${note.duration}%`;
    const ele = document.createElement('div');
    ele.classList.add('synth-note');
    ele.style.setProperty('left', x);
    ele.style.setProperty('top', y);
    ele.style.setProperty('width', width);

    const rightAnchor = document.createElement('div');
    rightAnchor.classList.add('right-anchor');
    ele.appendChild(rightAnchor);

    const normalVal = note.getNormalizedNoteValue(scaleHelper, baseNote);
    const label = document.createElement('p');
    label.innerText = normalVal;
    ele.appendChild(label);

    let isMoving = false;
    let isDragRight = false;
    let xBuffer = 0;
    let yBuffer = 0;

    ele.addEventListener('mousedown', $event => {
      $event.preventDefault();
      $event.stopPropagation();
      isMoving = true;
      isDragRight = false;
      const elementBoundingBox = ele.getBoundingClientRect();
      const x = $event.clientX - elementBoundingBox.left;
      const y = $event.clientY - elementBoundingBox.top;
      xBuffer = Math.round(x);
      yBuffer = Math.round(y);
    });

    rightAnchor.addEventListener('mousedown', $event => {
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
          const parentDims = parentElement.getBoundingClientRect();
          const mouseX = event.clientX - xBuffer;
          const mouseY = event.clientY - yBuffer;
          const percentX = (mouseX - parentDims.left) / parentDims.width;
          const percentY = (mouseY - parentDims.top) / parentDims.height;
          const clampedX = Math.max(0, Math.min(1, percentX));
          const clampedY = Math.max(0, Math.min(1, percentY));
          const noteValue = clampedY * -2 + 1;
          const startTick = Math.round(clampedX * 100);
          note.value = noteValue;
          ele.style.setProperty('top', `${clampedY * 100}%`);
          const normalVal = note.getNormalizedNoteValue(scaleHelper, baseNote);
          label.innerText = normalVal;
          if (note.startTick !== startTick) {
            note.startTick = startTick;
            ele.style.setProperty('left', `${clampedX * 100}%`);
          }
        }
        else if (isDragRight) {
          const event = message.$event;
          event.preventDefault();
          event.stopPropagation();
          const parentDims = parentElement.getBoundingClientRect();
          const leftPosition = ele.getBoundingClientRect().left;
          const widthInPixels = event.clientX - leftPosition;
          const widthInPercent = widthInPixels / parentDims.width;
          const clampedY = Math.max(0, Math.min(1, widthInPercent));
          const noteDuration = Math.round(clampedY * 100);
          note.duration = noteDuration;
          ele.style.setProperty('width', `${clampedY * 100}%`);
        }

      }
    });
    return ele;
  })
  .forEach(ele => parentElement.appendChild(ele));
}


class SynthDriver extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    const visualizerElement = this.root.getElementById('visualizer');
    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);

    buildNoteVisualization(visualizerElement, noteSequence);
    this.playHead = this.root.getElementById('playhead');
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        const note = noteSequence.getNoteByTick(index++);
        if (index >= STEP_LENGTH) {
          index = 0;
        }
        if (!note) {
          return;
        }

        const address = 'TB-03';
        const duration = note.duration * metronome.tempo;
        const onTime = time.midi;
        const offTime = time.midi + duration;
        const noteValue = note.getNormalizedNoteValue(scaleHelper, baseNote);


        // send on note signal
        eventBus.publish({
          address,
          note: noteValue,
          value: note.velocity,
          isOn: true,
          time: onTime
        });
        // send off note signal
        eventBus.publish({
          address,
          note: noteValue,
          value: note.velocity,
          isOn: false,
          time: offTime
        });

      },
      render: (tick, lastTick) => {
        const playHeadPosition = tick % STEP_LENGTH;
        this.playHead.style.setProperty('left', `${playHeadPosition}%`);
      },
      start: () => console.log('synth start'),
      stop: () => console.log('synth stop')
    };
  }

}

export default new Component(COMPONENT_NAME, SynthDriver);
