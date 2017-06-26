import app from 'components/app';
import markovBox from 'components/markov-box';
import markovState from 'components/markov-state';
import synthDriver from 'components/synth';
import button from 'components/button';
import midiManager from 'components/midi';

const components = [
  app,
  markovBox,
  markovState,
  synthDriver,
  button,
  midiManager
];

components.forEach(component => customElements.define(component.tag, component.element));
