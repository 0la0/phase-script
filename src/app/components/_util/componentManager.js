import app from 'components/app';
import markovBox from 'components/markov-box';
import markovState from 'components/markov-state';
import synthDriver from 'components/synth';
import SynthNote from 'components/synth-note';
import button from 'components/button';
import midiManager from 'components/midi';
import PolyRythm from 'components/poly-rythm';
import PolyBox from 'components/poly-box';
import MessageFitler from 'components/message-filter';
import Metronome from 'components/metronome';
import ScaleSelector from 'components/scale-selector';

const components = [
  app,
  markovBox,
  markovState,
  synthDriver,
  SynthNote,
  button,
  midiManager,
  PolyRythm,
  PolyBox,
  MessageFitler,
  Metronome,
  ScaleSelector
];

components.forEach(component => customElements.define(component.tag, component.element));
