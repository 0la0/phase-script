import app from 'components/app';
import markovBox from 'components/markov-box';
import markovState from 'components/markov-state';
import Sequencer from 'components/sequencer';
import SynthNote from 'components/synth-note';
import button from 'components/button';
import midiManager from 'components/midi';
import PolyRythm from 'components/poly-rythm';
import PolyBox from 'components/poly-box';
import MessageFitler from 'components/message-filter';
import Metronome from 'components/metronome';
import ScaleSelector from 'components/scale-selector';
import RouterOutlet from 'components/router';
import GraphicsRoot from 'components/graphics/graphics-root';
import OscSynth from 'components/osc-synth';
import OscVoice from 'components/osc-voice';
import GraphicsController from 'components/graphics-controller';
import SliderHorizontal from 'components/slider-horizontal';
import GrainMaker from 'components/grain-maker';
import ComboBox from 'components/combo-box';
import Sampler from 'components/sampler';
import SampleVisualizer from 'components/sample-visualizer';
import SoundRoot from 'components/sound-root';
import TriggerBox from 'components/trigger-box';
import FftVisualizer from 'components/fft-visualizer';
import EventNetwork from 'components/event-network';
import CanvasMenu from 'components/event-network/canvas-menu';
import PropertyMenu from 'components/event-network/property-menu';
import EventCycle from 'components/event-cycle';
import PatchSpace from 'components/patch-space';
import DraggableWrapper from 'components/patch-space/draggable';
import EventAddress from 'components/event-address';
import PatchDac from 'components/patch-dac';
import AdsrEnvelope from 'components/adsr-envelope';
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

const components = [
  app,
  markovBox,
  markovState,
  Sequencer,
  SynthNote,
  button,
  midiManager,
  PolyRythm,
  PolyBox,
  MessageFitler,
  Metronome,
  ScaleSelector,
  RouterOutlet,
  GraphicsRoot,
  OscSynth,
  GraphicsController,
  SliderHorizontal,
  OscVoice,
  GrainMaker,
  ComboBox,
  Sampler,
  SampleVisualizer,
  SoundRoot,
  TriggerBox,
  FftVisualizer,
  EventNetwork,
  CanvasMenu,
  PropertyMenu,
  EventCycle,
  PatchSpace,
  DraggableWrapper,
  EventAddress,
  PatchDac,
  AdsrEnvelope,
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
];

components.forEach(component => customElements.define(component.tag, component.element));
