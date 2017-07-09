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
const scaleHelper = new ScaleHelper(aeolian);


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
  const parentDims = parentElement.getBoundingClientRect();

  const noteList = Array.from(noteSequence.sequence);

  noteList.map(entry => {
    const [startTick, note] = entry;
    const yVal = ((note.value - 1) / -2) * 100;
    const y = `${yVal}%`;
    const x = `${startTick}%`;
    const width = `${note.duration}%`;
    const ele = document.createElement('div');
    ele.classList.add('synth-note');
    ele.style.setProperty('left', x);
    ele.style.setProperty('top', y);
    ele.style.setProperty('width', width);

    const realVal = Math.floor(note.value * 100) / 100;
    const normalVal = note.getNormalizedNoteValue(scaleHelper, baseNote);
    ele.innerText = normalVal;
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
