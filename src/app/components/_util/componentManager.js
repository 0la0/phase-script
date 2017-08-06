import app from 'components/app';
import markovBox from 'components/markov-box';
import markovState from 'components/markov-state';
import synthDriver from 'components/synth';
import button from 'components/button';
import midiManager from 'components/midi';
import PolyRythm from 'components/poly-rythm';
import PolyBox from 'components/poly-box';
import MessageFitler from 'components/message-filter';
import Metronome from 'components/metronome';

const components = [
  app,
  markovBox,
  markovState,
  synthDriver,
  button,
  midiManager,
  PolyRythm,
  PolyBox,
  MessageFitler,
  Metronome
];

components.forEach(component => customElements.define(component.tag, component.element));
