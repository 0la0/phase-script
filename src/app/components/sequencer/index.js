import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import scaleHelper from 'services/scale/scaleHelper';
import audioEventBus from 'services/AudioEventBus';
import Note from './modules/note';
import NoteSequence from './modules/noteSequence';
import metronomeManager from 'services/metronome/metronomeManager';

const COMPONENT_NAME = 'sequence-driver';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();
const STEP_LENGTH = 64;

class Sequencer extends BaseComponent {

  constructor() {
    super(style, markup);
    this.noteSequence = new NoteSequence(0);
    this.publishAddress;
  }

  connectedCallback() {
    const schedulable = this.buildSchedulable();
    const scheduler = metronomeManager.getScheduler();
    scheduler.register(schedulable);

    this.synthContainer = this.root.getElementById('visualizer');
    this.noteContainer = this.root.getElementById('noteContainer');
    this.playHead = this.root.getElementById('playhead');
    this.baseNoteInput = this.root.getElementById('base-note-input');
    this.sendComboBox = this.root.getElementById('sendComboBox');
    this.buildNotes();

    const elementWidth = this.noteContainer.getBoundingClientRect().width;
    const tickPercentWidth = 100 * (elementWidth / STEP_LENGTH) / elementWidth;
    const backgroundImage = getBackgroundImage(tickPercentWidth);
    this.synthContainer.style.setProperty('background-image', backgroundImage);

    this.synthContainer.addEventListener('dblclick', $event => {
      $event.preventDefault();
      $event.stopPropagation();
      const boundingBox = this.noteContainer.getBoundingClientRect();
      const percentX = ($event.clientX - boundingBox.left) / boundingBox.width;
      const startTick = Math.round(percentX * STEP_LENGTH);
      const percentY = ($event.clientY - 10 - boundingBox.top) / boundingBox.height;
      const noteValue = percentY * -2 + 1;
      const note = new Note(noteValue, 4, 12, startTick);
      const synthNoteElement = document.createElement('synth-note');
      synthNoteElement.init(note, STEP_LENGTH, this.removeNote.bind(this), this.getBaseNote.bind(this));
      this.noteContainer.appendChild(synthNoteElement);
      this.noteSequence.addNote(note);
    });

    // continuously update output options
    audioEventBus.subscribe({
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        this.sendComboBox.setOptions(optionList);
      }
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
        const eventMessage = this.getAudioEventMessage(note, tickNumber, time);
        audioEventBus.publish(eventMessage);
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

  getAudioEventMessage(note, tickNumber, time) {
    let onTime;
    let offTime;
    let noteValue;
    if (this.publishAddress === 'TB-03') {
      onTime = time.midi;
      offTime = onTime + metronome.getTickLength() * note.duration * 1000;
      noteValue = note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());
    }
    else {
      onTime = time.audio;
      offTime = onTime + metronome.getTickLength() * note.duration;
      noteValue = note.getNormalizedNoteValue(scaleHelper, parseInt(this.baseNoteInput.value));
    }
    return {
      address: this.publishAddress,
      note: noteValue,
      value: note.velocity,
      onTime,
      offTime
    }
  }

  getBaseNote() {
    return parseInt(this.baseNoteInput.value);
  }

  onClear() {
    this.noteSequence = new NoteSequence(0);
    this.clearNotes();
    this.buildNotes();
  }

  onGenerateRandom() {
    this.noteSequence = new NoteSequence(STEP_LENGTH);
    this.clearNotes();
    this.buildNotes();
  }

  onSendChange(value) {
    this.publishAddress = value;
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
