import App from 'components/app';

// PRIMITIVES
import Button from 'components/primitives/button';
import SliderHorizontal from 'components/primitives/slider-horizontal';
import ComboBox from 'components/primitives/combo-box';
import RouterOutlet from 'components/primitives/router-outlet';

// PATCH-SPACE
import PatchSpace from 'components/patch-space';
import DraggableWrapper from 'components/patch-space/draggable';
// PATCH-UGENS
import Sampler from 'components/patch-space/unit-generators/sampler';
import SampleVisualizer from 'components/patch-space/unit-generators/sampler/sample-visualizer';
import PatchWaveshaper from 'components/patch-space/unit-generators/waveshaper';


import Metronome from 'components/metronome';
import ScaleSelector from 'components/scale-selector';
import GraphicsRoot from 'components/graphics/graphics-root';
import OscVoice from 'components/osc-voice';
import GraphicsController from 'components/graphics-controller';
import SoundRoot from 'components/sound-root';
import FftVisualizer from 'components/fft-visualizer';
import EventNetwork from 'components/event-network';
import CanvasMenu from 'components/event-network/canvas-menu';
import PropertyMenu from 'components/event-network/property-menu';
import EventCycle from 'components/event-cycle';

import EventAddress from 'components/event-address';
import PatchDac from 'components/patch-dac';
import PatchChorus from 'components/patch-chorus';
import PatchDelay from 'components/patch-delay';
import PatchReverb from 'components/patch-reverb';
import PatchPulse from 'components/patch-pulse';
import PatchFilter from 'components/patch-filter';
import PatchGain from 'components/patch-gain';
import PatchParam from 'components/patch-param';
import PatchLfo from 'components/patch-lfo';
import PatchGrain from 'components/patch-grain';
import PatchMessageSpread from 'components/patch-message-spread';
import PatchMidiInterface from 'components/patch-midi-interface';
import PatchMessageRepeater from 'components/patch-message-repeater';

const components = [
  App,

  // PRIMITIVES
  Button,
  ComboBox,
  SliderHorizontal,
  RouterOutlet,

  // PATCH-SPACE
  PatchSpace,
  DraggableWrapper,
  // PATCH-UGENS
  Sampler,
  SampleVisualizer,
  PatchWaveshaper,

  Metronome,
  ScaleSelector,
  GraphicsRoot,
  GraphicsController,
  OscVoice,

  SoundRoot,
  FftVisualizer,
  EventNetwork,
  CanvasMenu,
  PropertyMenu,
  EventCycle,
  EventAddress,
  PatchDac,
  PatchChorus,
  PatchDelay,
  PatchReverb,
  PatchPulse,
  PatchFilter,
  PatchGain,
  PatchParam,
  PatchLfo,
  PatchGrain,
  PatchMessageSpread,
  PatchMidiInterface,
  PatchMessageRepeater,
];

components.forEach(component => customElements.define(component.tag, component.element));
