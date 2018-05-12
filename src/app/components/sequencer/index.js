import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import metronomeManager from 'services/metronome/metronomeManager';
import scaleHelper from 'services/scale/scaleHelper';
import { audioEventBus } from 'services/EventBus';
import Note from './modules/note';
import NoteSequence from './modules/noteSequence';

const COMPONENT_NAME = 'sequence-driver';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const metronome = metronomeManager.getMetronome();
const STEP_LENGTH = 64;

const ARP = {
  LENGTH: 4,
};

function buildArpSequence(originalSequence) {
  const allTicks = originalSequence.sequence
    .map(note => note.startTick)
    .sort((a, b) => a - b);
  if (!allTicks) { return []; }
  let currentTick = originalSequence.getNextNoteIndex(0);
  const arpSequence = [];

  allTicks.forEach((tickIndex, arrIndex, arr) => {
    const baseNote = originalSequence.getNoteByTick(tickIndex).clone();
    const timeToNextArp = ARP.LENGTH - (baseNote.startTick % ARP.LENGTH);
    baseNote.duration = timeToNextArp;

    if (arrIndex === arr.length - 1) { return; }

    const startArp = tickIndex;
    const nextIndex = allTicks[arrIndex + 1];
    const nextNote = originalSequence.getNoteByTick(nextIndex);
    const numArps = Math.floor((nextIndex - tickIndex) / ARP.LENGTH);

    for (let i = 0; i < numArps; i++) {
      const index = startArp + (i * ARP.LENGTH);
      const value = baseNote.value + (0.2 * i);
      let duration = ARP.LENGTH;
      if (index + duration > nextNote.startTick) {
        duration = nextNote.startTick - index;
      }
      const note = new Note(value, duration, 12, index);
      arpSequence.push(note);
    }
  });

  const noteSequence = new NoteSequence(0);
  noteSequence.sequence = arpSequence;
  return noteSequence;
}

class Sequencer extends BaseComponent {

  constructor() {
    super(style, markup);
    this.noteSequence = new NoteSequence(0);
    this.publishAddress;
    this.arpIsOn = false;
  }

  connectedCallback() {
    this.schedulable = this.buildSchedulable();
    metronomeManager.getScheduler().register(this.schedulable);

    this.synthContainer = this.root.getElementById('visualizer');
    this.noteContainer = this.root.getElementById('noteContainer');
    this.playHead = this.root.getElementById('playhead');
    this.baseNoteInput = this.root.getElementById('base-note-input');
    this.sendComboBox = this.root.getElementById('sendComboBox');
    this.buildNotes();

    this.arpLength = this.root.getElementById('arp-length');
    this.arpLength.value = ARP.LENGTH;
    this.arpLength.addEventListener('change', event => {
      const value = parseInt(event.target.value);
      ARP.LENGTH = value;
      if (this.arpIsOn) {
        this.buildArpSequence();
      }
    });

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
      synthNoteElement.init(note, STEP_LENGTH, this.removeNote.bind(this), this.getBaseNote.bind(this), this.onNoteChange.bind(this));
      this.noteContainer.appendChild(synthNoteElement);
      this.noteSequence.addNote(note);
    });

    // continuously update output options
    audioEventBus.subscribe({
      onNewSubscription: addresses => {
        const optionList = addresses.map(address => ({
          label: address, value: address
        }));
        setTimeout(() => this.sendComboBox.setOptions(optionList));
      }
    });
  }

  disconnectedCallback() {
    metronomeManager.getScheduler().deregister(this.schedulable);
  };

  attributeChangedCallback(attribute, oldVal, newVal) {}

  clearNotes() {
    [...this.noteContainer.children]
      .forEach(ele => this.noteContainer.removeChild(ele));
  }

  buildNotes() {
    this.noteSequence.sequence
      .map(note => {
        const synthNoteElement = document.createElement('synth-note');
        synthNoteElement.init(note, STEP_LENGTH, this.removeNote.bind(this), this.getBaseNote.bind(this), this.onNoteChange.bind(this));
        return synthNoteElement;
      })
      .forEach(ele => this.noteContainer.appendChild(ele));
  }

  buildSchedulable() {
    return {
      processTick: (tickNumber, time) => {
        const note = this.arpIsOn ?
          this.arpSequence.getNoteByTick(tickNumber % STEP_LENGTH) :
          this.noteSequence.getNoteByTick(tickNumber % STEP_LENGTH);
        if (!note) { return; }
        const eventMessage = this.getAudioEventMessage(note, tickNumber, time);
        audioEventBus.publish(eventMessage);
      },
      render: (tick, lastTick) => {
        const relativeTick = tick % STEP_LENGTH;
        const playHeadPosition = (relativeTick / STEP_LENGTH) * 100;
        this.playHead.style.setProperty('left', `${playHeadPosition}%`);
      },
      start: () => {},
      stop: () => {}
    };
  }

  removeNote(targetNote, targetElement) {
    this.noteSequence.removeNote(targetNote);
    this.noteContainer.removeChild(targetElement);
  }

  getAudioEventMessage(note, tickNumber, time) {
    let onTime;
    let offTime;
    const noteValue = note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());

    // TODO: move this logic to consumer
    if (this.publishAddress === 'TB-03') {
      onTime = time.midi;
      offTime = onTime + metronome.getTickLength() * note.duration * 1000;
      noteValue = note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());
    }
    else {
      onTime = time.audio;
      offTime = onTime + metronome.getTickLength() * note.duration;
      // noteValue = note.getNormalizedNoteValue(scaleHelper, this.getBaseNote());
    }
    return {
      address: this.publishAddress,
      note: noteValue,
      value: note.velocity,
      time,
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

  setOnRemoveCallback(onRemoveCallback) {
    this.onRemoveCallback = onRemoveCallback;
  }

  onRemove() {
    this.onRemoveCallback && this.onRemoveCallback();
  }

  onNoteChange() {
    if (this.arpIsOn) {
      this.buildArpSequence();
    }
  }

  onArpClick(isOn) {
    this.arpIsOn = !this.arpIsOn;
    if (this.arpIsOn) {
      this.buildArpSequence();
    }
    else {
      this.arpSequence = null;
    }
  }

  buildArpSequence() {
    this.arpSequence = buildArpSequence(this.noteSequence);
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
