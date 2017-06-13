const COMPONENT_NAME = 'markov-box';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

import {MarkovState} from '../markov-state/markov-state';

function buildShadowDom(element, innerHTML) {
  let shadowRoot = element.attachShadow({mode: 'open'});
  const template = document.createElement('template');
  template.innerHTML = innerHTML;
  const instance = template.content.cloneNode(true);
  shadowRoot.appendChild(instance);
  return shadowRoot;
}

class MarkovBox extends HTMLElement {

  constructor() {
    super();
    const styleMarkup = `<style>${style}</style>${markup}`;
    this.root = buildShadowDom(this, styleMarkup);
  }

  connectedCallback() {
    this.width = 4;
    this.height = 4;
    this.grid = buildGrid(this.width, this.height, this);
    this.root.appendChild(this.grid.root);

    this.activeIndex = 5;
    this.isRunning = false;
    setTimeout(() => this.start());
  }

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  start() {
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    const currentNode = this.grid.elementList[this.activeIndex];
    const previousIndex = this.activeIndex;
    const nextState = currentNode.getNextState();
    const nextIndex = nextState.edge;
    const bucket = nextState.cumulativeProbability - nextState.normalProbability;
    
    this.activeIndex = nextIndex;
    this.grid.elementList[previousIndex].turnOff();
    this.grid.elementList[this.activeIndex].turnOn();
    
    if (this.isRunning) {
      setTimeout(this.loop.bind(this), 1000);
    }
  }



}

function buildGrid(width, height, component) {
  const size = width * height;
  const gridParent = document.createElement('div');
  gridParent.classList.add('markov-box_grid');
  const gridElementList = Array(size).fill(null)
    .map((ele, index) => {
      const element = document.createElement('markov-state');
      const params = {
        index: index,
        width: width,
        height: height
      };
      element.setAttribute('id', index);
      element.setAttribute('params', JSON.stringify(params));
      return element;
    });

  gridElementList.forEach(element => gridParent.appendChild(element));  
  gridParent.addEventListener('click', event => component.activeIndex = event.target.id); 

  return {
    root: gridParent,
    elementList: gridElementList
  };
}


const MARKOV_BOX = {
  tag: COMPONENT_NAME,
  elementClass: MarkovBox
};
export default MARKOV_BOX;
