import BaseComponent from 'common/util/base-component';
import MidiMessage, { getCommandString, } from 'services/midi/MidiMessage';
import style from './midi-device.css';
import markup from './midi-device.html';

const checkmark = '\u2713';
// const COMMAND_DISPLAY_MAP = {
//   8:  'Off',
//   9:  'On',
//   10: 'AT',
//   11: 'CC',
//   12: 'PtchCh',
//   13: 'CtrlP',
//   14: 'PtchBnd',
//   15: 'SysEx'
// };

export default class MidiDevice extends BaseComponent {
  static get tag() {
    return 'midi-device';
  }

  constructor(device) {
    super(style, markup, [ 'label', 'input', 'output', 'toggleButton', 'messageContainer', 'command', 'channel', 'note', 'value' ]);
    this.device = device;
    this.dom.label.textContent = device.getDeviceName();
    this.isPrintingInput = false;
    this.message = '';
    this.messageHandler = this.handleDeviceMessage.bind(this);
    if (this.device.hasOutput) {
      this.dom.output.textContent = checkmark;
    }
    if (this.device.inputRef) {
      this.dom.input.textContent = checkmark;
    } else {
      this.shadowRoot.removeChild(this.dom.toggleButton);
    }
  }

  disconnectedCallback() {
    if (!this.device.inputRef) {
      return;
    }
    this.device.inputRef.removeEventListener('midimessage', this.messageHandler);
  }

  handleDeviceMessage(event) {
    if (event.data.length === 1 && event.data[0] === 248) {
      return;
    }
    this.message = MidiMessage.fromSerialized(event.data);
    requestAnimationFrame(() => {
      this.dom.command.textContent = getCommandString(this.message.command);
      this.dom.channel.textContent = this.message.channel;
      this.dom.note.textContent = this.message.note;
      this.dom.value.textContent = this.message.value;
    });
  }

  onToggleClick(event) {
    this.isPrintingInput = event.target.isOn;
    if (!this.device.inputRef) {
      return;
    }
    if (this.isPrintingInput) {
      this.device.inputRef.addEventListener('midimessage', this.messageHandler);
      this.dom.messageContainer.classList.add('message-container--visible');
    } else {
      this.device.inputRef.removeEventListener('midimessage', this.messageHandler);
      this.dom.messageContainer.classList.remove('message-container--visible');
    }
  }
}
