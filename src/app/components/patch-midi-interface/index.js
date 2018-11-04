import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getPosNeg, clamp, IntArray } from 'components/_util/math';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import MidiMessage, { COMMAND } from 'services/midi/MidiMessage';

const COMPONENT_NAME = 'patch-midi-interface';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = [ 'deviceSelector', 'channelSelector', ];

class PatchMidiInterface extends BaseComponent {
  constructor(options) {
    super(style, markup, dom);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('MIDI Out', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.EMPTY);
    this.outputDevice;
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
      .then(options => this.dom.deviceSelector.setOptions(options))
  }

  onDeviceChange(device) {
    provideMidiFactory()
      .then(midiFactory => {
        this.outputDevice = midiFactory.getOutputByName(device);
        const input = midiFactory.getInputByName(device);
        input.onmidimessage = event => {
          if (event.data.length === 1 && event.data[0] === 248) {
            return;
          }
          const msg = MidiMessage.fromSerialized(event.data);
          console.log(this.name, msg)
        };
      });
  }

  onChannelChange(channel) { this.channel = channel; }

  // TODO: note / cc toggle
  schedule(message) {
    if (!this.outputDevice) { return; }
    const offTime = message.time.midi + 100; // TODO: handle note duration
    const msgValue = 64;
    const onMessage = new MidiMessage(COMMAND.ON, this.channel, message.note, msgValue).serialize();
    const offMessage = new MidiMessage(COMMAND.OFF, this.channel, message.note, msgValue).serialize();
    this.outputDevice.send(onMessage, message.time.midi);
    this.outputDevice.send(offMessage, offTime);
  }
}

export default new Component(COMPONENT_NAME, PatchMidiInterface);