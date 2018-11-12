import App from 'components/app';
import SynthNote from 'components/synth-note';
import Button from 'components/button';
import Metronome from 'components/metronome';
import ScaleSelector from 'components/scale-selector';
import RouterOutlet from 'components/router-outlet';
import GraphicsRoot from 'components/graphics/graphics-root';
import OscVoice from 'components/osc-voice';
import GraphicsController from 'components/graphics-controller';
import SliderHorizontal from 'components/slider-horizontal';
import ComboBox from 'components/combo-box';
import Sampler from 'components/sampler';
import SampleVisualizer from 'components/sample-visualizer';
import SoundRoot from 'components/sound-root';
import FftVisualizer from 'components/fft-visualizer';
import EventNetwork from 'components/event-network';
import CanvasMenu from 'components/event-network/canvas-menu';
import PropertyMenu from 'components/event-network/property-menu';
import EventCycle from 'components/event-cycle';
import PatchSpace from 'components/patch-space';
import DraggableWrapper from 'components/patch-space/draggable';
import EventAddress from 'components/event-address';
import PatchDac from 'components/patch-dac';
import EqualizerThree from 'components/equalizer-three';
import PatchChorus from 'components/patch-chorus';
import PatchDelay from 'components/patch-delay';
import PatchWaveshaper from 'components/patch-waveshaper';
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
  SynthNote,
  Button,
  Metronome,
  ScaleSelector,
  RouterOutlet,
  GraphicsRoot,
  GraphicsController,
  SliderHorizontal,
  OscVoice,
  ComboBox,
  Sampler,
  SampleVisualizer,
  SoundRoot,
  FftVisualizer,
  EventNetwork,
  CanvasMenu,
  PropertyMenu,
  EventCycle,
  PatchSpace,
  DraggableWrapper,
  EventAddress,
  PatchDac,
  EqualizerThree,
  PatchChorus,
  PatchDelay,
  PatchWaveshaper,
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
