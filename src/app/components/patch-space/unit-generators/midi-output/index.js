import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { IntArray } from 'services/Math';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage, { COMMAND } from 'services/midi/MidiMessage';

const COMPONENT_NAME = 'midi-output';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = [ 'deviceSelector', 'channelSelector', 'noteInputContainer', ];

class MidiOutput extends BaseComponent {
  constructor() {
    super(style, markup, dom);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MIDI Out', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.EMPTY);
    this.outputDevice;
    this.isNote = true;
    this.noteValue = 60;
    this.channel = 0;
  }

  connectedCallback() {
    this.populateSelector();
    setTimeout(() => {
      const channels = IntArray(16).map(i => ({ label: i, value: i}));
      this.dom.channelSelector.setOptions(channels);
    });
  }

  populateSelector() {
    provideMidiFactory()
      .then(midiFactory => midiFactory.getOutputList().map(device => ({ label: device.name, value: device.name })))
      .then(options => {
        this.dom.deviceSelector.setOptions(options);
        if (options[0]) {
          this.handleDeviceChange({ target: options[0] });
        }
      });
  }

  handleDeviceChange(event) {
    const device = event.target.value;
    provideMidiFactory()
      .then(midiFactory => {
        this.outputDevice = midiFactory.getOutputByName(device);
        // TODO: move midi input to a  different module
        const input = midiFactory.getInputByName(device);
        input.onmidimessage = event => {
          if (event.data.length === 1 && event.data[0] === 248) {
            return;
          }
          const msg = MidiMessage.fromSerialized(event.data);
          console.log(this.name, msg);
        };
      })
      .catch(error => console.log('midi output connection error', error));
  }

  handleChannelChange(event) {
    this.channel = parseInt(event.target.value, 10);
  }

  handleNoteCcToggle() {
    this.isNote = !this.isNote;
    this.isNote ?
      this.dom.noteInputContainer.classList.add('row-hidden') :
      this.dom.noteInputContainer.classList.remove('row-hidden');
  }

  handleNoteChange(event) {
    this.noteValue = parseInt(event.target.value, 10);
  }

  schedule(message) {
    if (!this.outputDevice) { return; }
    this.isNote ? this.scheduleNote(message) : this.scheduleCC(message);
  }

  scheduleNote(message) {
    const offTime = message.time.midi + 100; // TODO: handle note duration
    const msgValue = 64;
    const onMessage = new MidiMessage(COMMAND.ON, this.channel, message.note, msgValue).serialize();
    const offMessage = new MidiMessage(COMMAND.OFF, this.channel, message.note, msgValue).serialize();
    this.outputDevice.send(onMessage, message.time.midi);
    this.outputDevice.send(offMessage, offTime);
  }

  scheduleCC(message) {
    const ccMessage = new MidiMessage(COMMAND.CC, this.channel, this.noteValue, message.note).serialize();
    this.outputDevice.send(ccMessage, message.time.midi);
  }
}

export default new Component(COMPONENT_NAME, MidiOutput);
