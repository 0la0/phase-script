import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import provideMidiFactory from 'services/midi/midiDeviceFactory';
import provideEventBus from 'services/EventBus/eventBusProvider';
import {getMessageFromObject} from 'services/midi/midiEventBus';

const COMPONENT_NAME = 'midi-manager';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const INSTRUMENTS = {
  TB03: 'TB-03'
};


class MidiManager extends BaseComponent {

  constructor() {
    super(style, markup);
    this.eventBus = provideEventBus();
    this.eventBus.subscribe({
      address: INSTRUMENTS.TB03,
      onNext: message => this.onSynthMessage(message)
    });
    this.tb03 = null;
  }

  connectedCallback() {

  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  onSynthMessage(message) {
    const midiMessage = {
      command: message.isOn ? 9 : 8,
      status: 1,
      note: message.note,
      value: message.value
    };
    this.tb03 && this.tb03.send(getMessageFromObject(midiMessage), message.time);
  }

  onRefreshDevices() {
    console.log('refresh devices');
    provideMidiFactory()
      .then(midiDeviceFactory => {
        const outputList = midiDeviceFactory.getOutputList();
        //console.log('outputList', outputList);
        this.tb03 = outputList.find(output => output.name === INSTRUMENTS.TB03);
      })
      .then(error => console.log('provideMidiFactory', error));
  }

}

export default new Component(COMPONENT_NAME, MidiManager);
