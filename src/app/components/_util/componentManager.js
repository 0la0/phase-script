//TODO: webpack aliases
import markovBox from '../markov-box/markov-box';
import markovState from '../markov-state/markov-state';


customElements.define(markovBox.tag, markovBox.element);
customElements.define(markovState.tag, markovState.element);
