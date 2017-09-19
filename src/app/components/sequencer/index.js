import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import scaleHelper from 'services/scale/scaleHelper';
import provideEventBus from 'services/EventBus/eventBusProvider';
import Note from './modules/note';
import NoteSequence from './modules/noteSequence';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'sequence-driver';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();
const eventBus = provideEventBus();
const STEP_LENGTH = 64;

class Sequencer extends BaseComponent {

  constructor() {
    super(style, markup);
    this.noteSequence = new NoteSequence(0);
  }

  connectedCallback() {
    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);

    this.synthContainer = this.root.getElementById('visualizer');
    this.noteContainer = this.root.getElementById('noteContainer');
    this.playHead = this.root.getElementById('playhead');
    this.clearButton = this.root.getElementById('clearButton');
    this.genRandomButton = this.root.getElementById('randomButton');
    this.baseNoteInput = this.root.getElementById('base-note-input');
    this.buildNotes();

    const elementWidth = this.synthContainer.getBoundingClientRect().width;
    const tickPercentWidth = 100 * (elementWidth / STEP_LENGTH) / elementWidth;
    const backgroundImage = getBackgroundImage(tickPercentWidth);
    this.synthContainer.style.setProperty('background-image', backgroundImage);

    this.synthContainer.addEventListener('dblclick', $event => {
      $event.preventDefault();
      $event.stopPropagation();
      const boundingBox = this.synthContainer.getBoundingClientRect();
      const percentX = $event.clientX / boundingBox.width;
      const startTick = Math.round(percentX * STEP_LENGTH) - 2;
      const percentY = ($event.clientY - boundingBox.top) / boundingBox.height;
      const noteValue = percentY * -2 + 1;
      const note = new Note(noteValue, 4, 12, startTick);
      const synthNoteElement = document.createElement('synth-note');
      synthNoteElement.init(note, STEP_LENGTH, this.removeNote.bind(this), this.getBaseNote.bind(this));
      this.synthContainer.appendChild(synthNoteElement);
      this.noteSequence.addNote(note);
    });

    this.clearButton.addEventListener('click', $event => {
      this.noteSequence = new NoteSequence(0);
      this.clearNotes();
      this.buildNotes();
    });
    this.genRandomButton.addEventListener('click', $event => {
      this.noteSequence = new NoteSequence(STEP_LENGTH);
      this.clearNotes();
      this.buildNotes();
    });
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  clearNotes() {
    [...this.noteContainer.children]
      .forEach(ele => this.noteContainer.removeChild(ele));
  }

  buildNotes() {
    this.noteSequence.sequence
      .map(note => {
        const synthNoteElement = document.createElement('synth-note');
        synthNoteElement.init(note, STEP_LENGTH, this.removeNote.bind(this), this.getBaseNote.bind(this));
        return synthNoteElement;
      })
      .forEach(ele => this.noteContainer.appendChild(ele));
  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        const note = this.noteSequence.getNoteByTick(tickNumber % STEP_LENGTH);
        if (!note) {
          return;
        }
        // this.publishToMidi(note, tickNumber, time);
        this.publishToAudio(note, tickNumber, time);
      },
      render: (tick, lastTick) => {
        const relativeTick = tick % STEP_LENGTH;
        const playHeadPosition = (relativeTick / STEP_LENGTH) * 100;
        this.playHead.style.setProperty('left', `${playHeadPosition}%`);
      },
      start: () => console.log('synth start'),
      stop: () => console.log('synth stop')
    };
  }

  removeNote(targetNote, targetElement) {
    this.noteSequence.removeNote(targetNote);
    this.noteContainer.removeChild(targetElement);
  }

  publishToMidi(note, tickNumber, time) {
    const address = 'TB-03';
    const onTime = time.midi;
    const offTime = onTime + metronome.getTickLength() * note.duration * 1000;
    const noteValue = note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());

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
  }

  publishToAudio(note, tickNumber, time) {
    const address = 'SYNTH';
    const onTime = time.audio;
    const offTime = onTime + metronome.getTickLength() * note.duration;
    const noteValue = note.getNormalizedNoteValue(scaleHelper, parseInt(this.baseNoteInput.value));

    // send on note signal
    eventBus.publish({
      address,
      note: noteValue,
      value: note.velocity,
      onTime,
      offTime
    });
  }

  getBaseNote() {
    return parseInt(this.baseNoteInput.value);
  }

}

function getBackgroundImage(widthInPercent) {
  const lineColor = '#CCCCCC';
  return `
    repeating-linear-gradient(
      90deg,
      ${lineColor},
      ${lineColor}, 3px,
      transparent 0,
      transparent ${widthInPercent * 4}%
    ),
    repeating-linear-gradient(
      90deg,
      ${lineColor},
      ${lineColor}, 1px,
      transparent 0,
      transparent ${widthInPercent}%
    )
  `;
}

export default new Component(COMPONENT_NAME, Sequencer);
