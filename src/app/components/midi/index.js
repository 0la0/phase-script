import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import { audioEventBus } from 'services/EventBus';
import {getMessageFromObject, getObjectFromMessage} from 'services/midi/midiEventBus';

const COMPONENT_NAME = 'midi-manager';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const INSTRUMENTS = {
  TB03: 'TB-03',
  TR09: 'TR-09'
};

const TR09_VALUES = {
  ON: 50,
  ACCENT: 80,
  OFF: 0
};

const TR09_CHANNELS = {
  BASS: 36,
  SNARE: 38,
  LOW_TOM: 43,
  MID_TOM: 47,
  HIGH_TOM: 50,
  RIM: 37,
  CLAP: 39,
  HAT: 42, // OPEN => ACCENT, CLOSED => REGULAR
  CRASH: 49,
  RIDE: 51
};


class MidiManager extends BaseComponent {

  constructor() {
    super(style, markup);
    this.tb03 = null;
    this.tr09 = null;
  }

  connectedCallback() {
    this.onRefreshDevices();

    audioEventBus.subscribe({
      address: INSTRUMENTS.TB03,
      onNext: message => this.onSynthMessage(message)
    });

    audioEventBus.subscribe({
      address: INSTRUMENTS.TR09,
      onNext: this.onDrumMessage.bind(this)
    });
  }

  disconnectedCallback() {};

  onSynthMessage(message) {
    const onMessage = {
      command: 9,
      status: 1,
      note: message.note,
      value: message.value
    };

    const offMessage = {
      command: 8,
      status: 1,
      note: message.note,
      value: message.value
    };

    this.tb03 && this.tb03.send(getMessageFromObject(onMessage), message.onTime);
    this.tb03 && this.tb03.send(getMessageFromObject(offMessage), message.offTime);
  }

  onDrumMessage(message) {
    const midiMessage = {
      command: 9,
      status: 9,
      note: TR09_CHANNELS[message.note],
      value: TR09_VALUES.ON
    };
    this.tr09 && this.tr09.send(getMessageFromObject(midiMessage), message.time);
  }

  onRefreshDevices() {
    provideMidiFactory()
      .then(midiDeviceFactory => {
        const outputList = midiDeviceFactory.getOutputList();
        console.log('midi output list', outputList);
        console.log('midi input list', midiDeviceFactory.getInputList())

        // TODO: change to: midiDeviceFactory.getOutputByName(INSTRUMENTS.TB03);
        this.tb03 = outputList.find(output => output.name === INSTRUMENTS.TB03);
        this.tr09 = midiDeviceFactory.getOutputByName(INSTRUMENTS.TR09);
        // this.tr09 = outputList.find(output => output.name === INSTRUMENTS.TR09);

        const trInput = midiDeviceFactory.getInputByName(INSTRUMENTS.TR09);
        // const testInput = midiDeviceFactory.getInputList.find(input => input.name === INSTRUMENTS.TRO9);
        if (trInput) {
          trInput.onmidimessage = event => {
            if (event.data.length === 1 && event.data[0] === 248) {
              return;
            }
            const msg = getObjectFromMessage(event.data);
            console.log('msg', msg)
          };
        }
      })
      .catch(error => console.log('provideMidiFactory error', error));
  }

}

export default new Component(COMPONENT_NAME, MidiManager);
