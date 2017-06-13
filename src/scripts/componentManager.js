//TODO: webpack aliases
import MARKOV_BOX from './markov-box/markov-box';
import {MARKOV_STATE} from './markov-state/markov-state';


customElements.define(MARKOV_BOX.tag, MARKOV_BOX.elementClass);
customElements.define(MARKOV_STATE.tag, MARKOV_STATE.elementClass);
