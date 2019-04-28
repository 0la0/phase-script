import MidiEditor from 'components/midi-editor';
import SampleEditor from 'components/sample-editor';
import SettingsEditor from 'components/settings-editor';

export default class EditorState {
  constructor({ midiButton, sampleButton, settingsButton, closeCallback }) {
    this.editorOff = 'editor';
    this.editorOn = 'editor-visible';
    this.midi = new MidiEditor(closeCallback);
    this.sample = new SampleEditor(closeCallback);
    this.settings = new SettingsEditor(closeCallback);
    this.midiButton = midiButton;
    this.sampleButton = sampleButton;
    this.settingsButton = settingsButton;
    this.midi.classList.add(this.editorOff);
    this.sample.classList.add(this.editorOff);
    this.settings.classList.add(this.editorOff);
  }

  render(editorState) {
    requestAnimationFrame(() => {
      if (editorState === 'MIDI') {
        this.midi.classList.add(this.editorOn);
      } else {
        this.midi.classList.remove(this.editorOn);
        this.midiButton.turnOff();
      }
      if (editorState === 'SAMPLE') {
        this.sample.classList.add(this.editorOn);
      } else {
        this.sample.classList.remove(this.editorOn);
        this.sampleButton.turnOff();
      }
      if (editorState === 'SETTINGS') {
        this.settings.classList.add(this.editorOn);
      } else {
        this.settings.classList.remove(this.editorOn);
        this.settingsButton.turnOff();
      }
    });
  }
}
