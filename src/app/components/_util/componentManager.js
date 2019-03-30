import App from 'components/app';

// PRIMITIVES
import TextButton from 'components/primitives/text-button';
import ToggleButton from 'components/primitives/toggle-button';
import SliderHorizontal from 'components/primitives/slider-horizontal';
import ComboBox from 'components/primitives/combo-box';
import RouterOutlet from 'components/primitives/router-outlet';
import TextInput from 'components/primitives/text-input';


import Metronome from 'components/metronome';
import GraphicsRoot from 'components/graphics/graphics-root';
import SoundRoot from 'components/sound-root';
import EventCycle from 'components/event-cycle';
import GraphicsEditor from 'components/graphics/graphics-editor';
import SoundVisualizer from 'components/SoundVisualizer';
import FftVisualizer from 'components/SoundVisualizer/FftVisualizer';

const components = [
  App,

  // PRIMITIVES
  TextButton,
  ToggleButton,
  ComboBox,
  SliderHorizontal,
  RouterOutlet,
  TextInput,

  Metronome,
  GraphicsRoot,
  SoundRoot,
  EventCycle,
  GraphicsEditor,
  SoundVisualizer,
  FftVisualizer,
];

components.forEach(component => customElements.define(component.tag, component));
