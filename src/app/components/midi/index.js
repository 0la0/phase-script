import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import midiDeviceManager from 'services/midi/deviceManager';

const COMPONENT_NAME = 'midi-manager';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class MidiManager extends BaseComponent {
  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    this.onRefreshDevices();
  }

  disconnectedCallback() {};

  onRefreshDevices() {
    midiDeviceManager.refreshMidiConnections();
  }
}

export default new Component(COMPONENT_NAME, MidiManager);
