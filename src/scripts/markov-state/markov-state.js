import {MarkovStateEntity} from './markovStateEntity';

const COMPONENT_NAME = 'markov-state';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const ACTIVE_CLASS = 'markov-state--active';

function buildShadowDom(element, innerHTML) {
  let shadowRoot = element.attachShadow({mode: 'open'});
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  const instance = template.content.cloneNode(true);
  shadowRoot.appendChild(instance);
  return shadowRoot;
}

class MarkovState extends HTMLElement {

  constructor() {
    super();
    const styleMarkup = `<style>${style}</style>${markup}`;
    this.root = buildShadowDom(this, styleMarkup);
    this.element = this.root.getElementById('markov-state');
  }

  static get observedAttributes() {
    return ['params'];
  }

  connectedCallback() {}

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {
    if (attribute === 'params') {
      const params = JSON.parse(newVal);
      //console.log('params', params);
      this.ele = buildMarkovState(params.index, params.width, params.height, this.element);
      this.markovState = this.ele.markovState;
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

function buildMarkovState(index, width, height, element) {
  const size = width * height;
  const edges = {};
  
  // Up
  if (Math.floor(index / width) > 0) {
    edges.up = index - width;
  }
  // Right
  if ((index + 1) % width > 0) {
    edges.right = index + 1;
  }  
  // Down
  if (index < (size - width)) {
    edges.down = index + width;
  }
  //Left
  if ((index % width) > 0) {
    edges.left = index - 1;
  }

  const markovState = new MarkovStateEntity(edges);

  // paint edges
  const up = markovState.getEdgeByDirection('up') || 0;
  const right = markovState.getEdgeByDirection('right') || 0;
  const down = markovState.getEdgeByDirection('down') || 0;
  const left = markovState.getEdgeByDirection('left') || 0;


  const borderSize = 6;

  element.style.setProperty('border-top', `${borderSize}px solid ${getColorFromValue(up)}`);
  element.style.setProperty('border-right', `${borderSize}px solid ${getColorFromValue(right)}`);
  element.style.setProperty('border-bottom', `${borderSize}px solid ${getColorFromValue(down)}`);
  element.style.setProperty('border-left', `${borderSize}px solid ${getColorFromValue(left)}`);

  return {
    element: element,
    markovState: markovState
  };
}

function getColorFromValue(value) {
  const colorValue = 255 - Math.floor(255 * value);
  const hexValue = colorValue.toString(16);
  return `#${hexValue}${hexValue}${hexValue}`;
}

const MARKOV_STATE = {
  tag: COMPONENT_NAME,
  elementClass: MarkovState
};

export {MARKOV_STATE, MarkovState};
