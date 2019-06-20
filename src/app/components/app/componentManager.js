import App from 'components/app';
import Primitives from 'common/primitives';
import Metronome from 'components/metronome-ctrl';
import GraphicsRoot from 'components/graphics/graphics-root';
import SoundRoot from 'components/sound-root';
import EditorTab from 'components/editor-window/editor-tab';
import EditorWindow from 'components/editor-window';
import EventCycle from 'components/event-cycle';
// import GraphicsEditor from 'components/graphics/graphics-editor';
import SoundVisualizer from 'components/SoundVisualizer';
import FftVisualizer from 'components/SoundVisualizer/FftVisualizer';
import MidiEditor from 'components/midi-editor';
import MidiDevice from 'components/midi-editor/midi-device';
import SampleDisplay from 'components/sample-editor/sample-display';
import SampleEditor from 'components/sample-editor';
import SampleLoader from 'components/sample-editor/sample-loader';
import SampleVisualizer from 'components/sample-editor/sample-visualizer';
import SettingsEditor from 'components/settings-editor';
import MarkupTestbed from 'components/ps-markup/markup-testbed';
import MarkupEditor from 'components/ps-markup/markup-editor';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  App,
  EventCycle,
  EditorTab,
  EditorWindow,
  FftVisualizer,
  // GraphicsEditor,
  GraphicsRoot,
  MarkupEditor,
  MarkupTestbed,
  Metronome,
  MidiEditor,
  MidiDevice,
  SampleDisplay,
  SampleEditor,
  SampleLoader,
  SampleVisualizer,
  SettingsEditor,
  SoundRoot,
  SoundVisualizer,
];

components.forEach(component => customElements.define(component.tag, component));
