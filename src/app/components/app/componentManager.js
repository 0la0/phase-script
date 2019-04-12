import App from 'components/app';
import Primitives from 'common/primitives';
import Metronome from 'components/metronome';
import GraphicsRoot from 'components/graphics/graphics-root';
import SoundRoot from 'components/sound-root';
import EventCycle from 'components/event-cycle';
import GraphicsEditor from 'components/graphics/graphics-editor';
import SoundVisualizer from 'components/SoundVisualizer';
import FftVisualizer from 'components/SoundVisualizer/FftVisualizer';
import MidiOut from 'components/midi-out';
import MidiIn from 'components/midi-in';
import MidiInDevice from 'components/midi-in/midi-in-device';
import LeapController from 'components/leap-controller';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  App,
  Metronome,
  GraphicsRoot,
  SoundRoot,
  EventCycle,
  GraphicsEditor,
  SoundVisualizer,
  FftVisualizer,
  MidiOut,
  MidiIn,
  MidiInDevice,
  LeapController,
];

components.forEach(component => customElements.define(component.tag, component));
