//TODO: webpack aliases
import app from '../app';
import markovBox from '../markov-box';
import markovState from '../markov-state';
import button from '../button';

const components = [
  app,
  markovBox,
  markovState,
  button
];

components.forEach(component => customElements.define(component.tag, component.element));
