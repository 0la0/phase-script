import App from 'components/app';
import Primitives from 'common/primitives';
import Metronome from 'components/metronome';
import GraphicsRoot from 'components/graphics/graphics-root';
import SoundRoot from 'components/sound-root';
import EventCycle from 'components/event-cycle';
import GraphicsEditor from 'components/graphics/graphics-editor';
import SoundVisualizer from 'components/SoundVisualizer';
import FftVisualizer from 'components/SoundVisualizer/FftVisualizer';

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
];

components.forEach(component => customElements.define(component.tag, component));
