import App from 'components/app';

// PRIMITIVES
import TextButton from 'components/primitives/text-button';
import ToggleButton from 'components/primitives/toggle-button';
import SliderHorizontal from 'components/primitives/slider-horizontal';
import ComboBox from 'components/primitives/combo-box';
import RouterOutlet from 'components/primitives/router-outlet';
import TextInput from 'components/primitives/text-input';

// PATCH-SPACE
import PatchSpace from 'components/patch-space';
import DraggableWrapper from 'components/patch-space/draggable';
// PATCH-UGENS
import Sampler from 'components/patch-space/unit-generators/sampler';
import SampleVisualizer from 'components/patch-space/unit-generators/sampler/sample-visualizer';
import PatchWaveshaper from 'components/patch-space/unit-generators/waveshaper';
import PatchReverb from 'components/patch-space/unit-generators/reverb';
import PatchPulse from 'components/patch-space/unit-generators/pulse';
import MidiOutput from 'components/patch-space/unit-generators/midi-output';
import MessageSpread from 'components/patch-space/unit-generators/message-spread';
import MessageRepeater from 'components/patch-space/unit-generators/message-repeater';
import PatchLfo from 'components/patch-space/unit-generators/lfo';
import PatchGrainulator from 'components/patch-space/unit-generators/grainulator';
import PatchGain from 'components/patch-space/unit-generators/gain';
import ResonanceFilter from 'components/patch-space/unit-generators/resonance-filter';
import PatchDelay from 'components/patch-space/unit-generators/delay';
import PatchDac from 'components/patch-space/unit-generators/dac';
import PatchChorus from 'components/patch-space/unit-generators/chorus';
import MessageAddress from 'components/patch-space/unit-generators/message-address';
import EnvelopedOsc from 'components/patch-space/unit-generators/enveloped-osc';
import MessageScale from 'components/patch-space/unit-generators/message-scale';
import GraphicsController from 'components/patch-space/unit-generators/graphics-controller';
import FftVisualizer from 'components/patch-space/unit-generators/dac/fft-visualizer';
import MessageThreshold from 'components/patch-space/unit-generators/message-threshold';
import MessageMap from 'components/patch-space/unit-generators/message-map';
import MessageFilter from 'components/patch-space/unit-generators/message-filter';

import Metronome from 'components/metronome';
import GraphicsRoot from 'components/graphics/graphics-root';
import SoundRoot from 'components/sound-root';
import EventNetwork from 'components/event-network';
import CanvasMenu from 'components/event-network/canvas-menu';
import PropertyMenu from 'components/event-network/property-menu';
import EventCycle from 'components/event-cycle';
import PatchParam from 'components/patch-param';

const components = [
  App,

  // PRIMITIVES
  TextButton,
  ToggleButton,
  ComboBox,
  SliderHorizontal,
  RouterOutlet,
  TextInput,

  // PATCH-SPACE
  PatchSpace,
  DraggableWrapper,
  // PATCH-UGENS
  Sampler,
  SampleVisualizer,
  PatchWaveshaper,
  PatchReverb,
  PatchPulse,
  MidiOutput,
  MessageSpread,
  MessageRepeater,
  PatchLfo,
  PatchGrainulator,
  PatchGain,
  ResonanceFilter,
  PatchDelay,
  PatchDac,
  PatchChorus,
  MessageAddress,
  EnvelopedOsc,
  MessageScale,
  GraphicsController,
  FftVisualizer,
  MessageThreshold,
  MessageMap,
  MessageFilter,

  Metronome,
  GraphicsRoot,
  SoundRoot,
  EventNetwork,
  CanvasMenu,
  PropertyMenu,
  EventCycle,
  PatchParam,
];

components.forEach(component => customElements.define(component.tag, component.element));
