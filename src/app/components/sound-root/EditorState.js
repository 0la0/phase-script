import MidiEditor from 'components/midi-editor';
import SampleEditor from 'components/sample-editor';
import SettingsEditor from 'components/settings-editor';

export default class EditorState {
  constructor() {
    const closeCallback = this._closeAll.bind(this);
    this.editorOff = 'editor';
    this.editorOn = 'editor-visible';
    this.midi = new MidiEditor(closeCallback);
    this.sample = new SampleEditor(closeCallback);
    this.settings = new SettingsEditor(closeCallback);
    this.midi.classList.add(this.editorOff);
    this.sample.classList.add(this.editorOff);
    this.settings.classList.add(this.editorOff);
    this.state = {
      midi: false,
      sample: false,
      settings: false,
    };
  }

  _closeAll() {
    this.state = {
      midi: false,
      sample: false,
      settings: false,
    };
    this.render();
  }

  toggleMidi(isOn) {
    this.state.midi = isOn;
    if (isOn) {
      this.state.sample = false;
      this.state.settings = false;
    }
    this.render();
  }

  toggleSample(isOn) {
    this.state.sample = isOn;
    if (isOn) {
      this.state.midi = false;
      this.state.settings = false;
    }
    this.render();
  }

  toggleSettings(isOn) {
    this.state.settings = isOn;
    if (isOn) {
      this.state.midi = false;
      this.state.sample = false;
    }
    this.render();
  }

  render() {
    this.state.midi ?
      this.midi.classList.add(this.editorOn) :
      this.midi.classList.remove(this.editorOn);
    this.state.sample ?
      this.sample.classList.add(this.editorOn) :
      this.sample.classList.remove(this.editorOn);
    this.state.settings ?
      this.settings.classList.add(this.editorOn) :
      this.settings.classList.remove(this.editorOn);
  }
}
