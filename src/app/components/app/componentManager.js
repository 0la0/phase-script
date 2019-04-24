import App from 'components/app';
import Primitives from 'common/primitives';
import Metronome from 'components/metronome-ctrl';
import GraphicsRoot from 'components/graphics/graphics-root';
import SoundRoot from 'components/sound-root';
import EventCycle from 'components/event-cycle';
import GraphicsEditor from 'components/graphics/graphics-editor';
import SoundVisualizer from 'components/SoundVisualizer';
import FftVisualizer from 'components/SoundVisualizer/FftVisualizer';
import MidiEditor from 'components/midi-editor';
import MidiDevice from 'components/midi-editor/midi-device';
import SampleDisplay from 'components/sample-editor/sample-display';
import SampleEditor from 'components/sample-editor';
import SampleLoader from 'components/sample-editor/sample-loader';
import SampleVisualizer from 'components/sample-editor/sample-visualizer';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  App,
  EventCycle,
  FftVisualizer,
  GraphicsEditor,
  GraphicsRoot,
  Metronome,
  MidiEditor,
  MidiDevice,
  SampleDisplay,
  SampleEditor,
  SampleLoader,
  SampleVisualizer,
  SoundRoot,
  SoundVisualizer
];

components.forEach(component => customElements.define(component.tag, component));
