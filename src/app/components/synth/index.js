import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import {dorian, major, aeolian, minorPentatonic, wholeHalfDiminished} from 'services/scale/scales';
import ScaleHelper from 'services/scale/scaleHelper';
import provideEventBus from 'services/EventBus/eventBusProvider';
import NoteSequence from './modules/noteSequence';
import metronomeManager from 'services/metronome/metronomeManager';
import {getBaseNote} from 'services/audioParams';

const COMPONENT_NAME = 'synth-driver';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();
const eventBus = provideEventBus();
const scaleHelper = new ScaleHelper(major);
const STEP_LENGTH = 64;

// Assume that 1 tick is 1% width
function tempBuildNoteVisualization(parentElement, noteSequence) {
  noteSequence.sequence
    .map(note => {
      const synthNoteElement = document.createElement('synth-note');
      synthNoteElement.setNote(note);
      return synthNoteElement;
    })
    .forEach(ele => parentElement.appendChild(ele));
}


class SynthDriver extends BaseComponent {

  constructor() {
    super(style, markup);
    this.index = 0;
    this.noteSequence = new NoteSequence();
  }

  connectedCallback() {
    const visualizerElement = this.root.getElementById('visualizer');
    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);

    tempBuildNoteVisualization(visualizerElement, this.noteSequence);
    this.playHead = this.root.getElementById('playhead');
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        const note = this.noteSequence.getNoteByTick(this.index++);
        if (this.index >= STEP_LENGTH) {
          this.index = 0;
        }
        if (!note) {
          return;
        }

        const address = 'TB-03';
        const onTime = time.midi;
        const offTime = onTime + note.duration * metronome.tempo; // TODO: midi vs audio?
        const noteValue = note.getNormalizedNoteValue(scaleHelper, getBaseNote());

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
