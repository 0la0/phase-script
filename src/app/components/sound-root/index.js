import BaseComponent from 'common/util/base-component';
import EventCycle from 'components/event-cycle';
import EditorState from './EditorState';
import style from './sound-root.css';
import markup from './sound-root.html';

export default class SoundRoot extends BaseComponent {
  static get tag() {
    return 'sound-root';
  }

  constructor() {
    super(style, markup, [ 'eventCycleContainer', 'midiButton', 'sampleButton' ]);
    this.editorState = new EditorState();
    this.shadowRoot.appendChild(this.editorState.midi);
    this.shadowRoot.appendChild(this.editorState.sample);
    this.shadowRoot.appendChild(this.editorState.settings);
  }

  onAddCycle() {
    const parentElement = this.dom.eventCycleContainer;
    const component = new EventCycle();
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }

  handleMidiClick(event) {
    this.editorState.toggleMidi(event.target.isOn);
  }

  handleSampleClick(event) {
    this.editorState.toggleSample(event.target.isOn);
  }

  handleSettingsClick(event) {
    this.editorState.toggleSettings(event.target.isOn);
  }
}
