import BaseComponent from 'common/util/base-component';
import EventCycle from 'components/event-cycle';
import MidiEditor from 'components/midi-editor';
import SampleEditor from 'components/sample-editor';
import style from './sound-root.css';
import markup from './sound-root.html';

const EDITOR_VISIBLE = 'editor-visible';

export default class SoundRoot extends BaseComponent {
  static get tag() {
    return 'sound-root';
  }

  constructor() {
    super(style, markup, [ 'eventCycleContainer', 'midiButton', 'sampleButton' ]);
    this.editorState = {
      midiEditor: false,
      sampleEditor: false,
    };
  }

  connectedCallback() {
    this.midiEditor = new MidiEditor(this.closeEditors.bind(this));
    this.midiEditor.classList.add('editor');
    this.sampleEditor = new SampleEditor(this.closeEditors.bind(this));
    this.sampleEditor.classList.add('editor');
    this.shadowRoot.appendChild(this.midiEditor);
    this.shadowRoot.appendChild(this.sampleEditor);
  }

  onAddCycle() {
    const parentElement = this.dom.eventCycleContainer;
    const component = new EventCycle();
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }

  renderEditorState() {
    if (this.editorState.midiEditor) {
      this.midiEditor.classList.add(EDITOR_VISIBLE);
      this.sampleEditor.classList.remove(EDITOR_VISIBLE);
    } else if (this.editorState.sampleEditor) {
      this.midiEditor.classList.remove(EDITOR_VISIBLE);
      this.sampleEditor.classList.add(EDITOR_VISIBLE);
    } else {
      this.midiEditor.classList.remove(EDITOR_VISIBLE);
      this.sampleEditor.classList.remove(EDITOR_VISIBLE);
    }
  }

  handleMidiClick(event) {
    const isOn = event.target.isOn;
    this.editorState.midiEditor = isOn;
    if (isOn) {
      this.editorState.sampleEditor = false;
      this.dom.sampleButton.turnOff();
    }
    this.renderEditorState();
  }

  handleSampleClick(event) {
    const isOn = event.target.isOn;
    this.editorState.sampleEditor = isOn;
    if (isOn) {
      this.editorState.midiEditor = false;
      this.dom.midiButton.turnOff();
    }
    this.renderEditorState();
  }

  closeEditors() {
    this.editorState.midiEditor = false;
    this.editorState.sampleEditor = false;
    this.dom.midiButton.turnOff();
    this.dom.sampleButton.turnOff();
    this.renderEditorState();
  }
}
