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
  EventNetwork
];

components.forEach(component => customElements.define(component.tag, component.element));
