//TODO: webpack aliases
import app from '../app';
import markovBox from '../markov-box';
import markovState from '../markov-state';
import synthDriver from '../synth';
import button from '../button';
import midiManager from '../midi';

const components = [
  app,
  markovBox,
  markovState,
  synthDriver,
  button,
  midiManager
];

components.forEach(component => customElements.define(component.tag, component.element));
