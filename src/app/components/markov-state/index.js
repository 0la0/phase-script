import {buildMarkovState} from './modules/markovStateBuilder';
import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'markov-state';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const ACTIVE_CLASS = 'markov-state--active';


class MarkovState extends BaseComponent {

  constructor() {
    super(style, markup);
    this.element = this.root.getElementById('markov-state');
    this.isActive = Math.random() < 0.4;
  }

  static get observedAttributes() {
    return ['params'];
  }

  connectedCallback() {}

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {
    if (attribute === 'params') {
      const params = JSON.parse(newVal);
      this.markovState = buildMarkovState(params.index, params.width, params.height, this.element, this.isActive);
    }
  }

  turnOn() {
    this.element.classList.add(ACTIVE_CLASS);
  }

  turnOff() {
    this.element.classList.remove(ACTIVE_CLASS);
  }

  getNextState() {
    return this.markovState.getNextState();
  }

}

export default new Component(COMPONENT_NAME, MarkovState);
