import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import graphicsChannel from 'services/BroadcastChannel';
import {getGraphicsStates} from 'components/graphics/graph/graphicsManager';

const COMPONENT_NAME = 'graphics-controler';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class GraphicsControler extends BaseComponent {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    const stateContainer = this.root.getElementById('optionsContainer');
    stateContainer.addEventListener('click', $event => {
      if (!$event.target.id) {
        return;
      }
      graphicsChannel.postMessage({
        type: 'GRAPHICS_MODE',
        value: $event.target.id
      });
    });
    getGraphicsStates()
      .map(name => {
        console.log('----name', name);
        const element = document.createElement('div');
        element.classList.add('option');
        element.innerText = name;
        element.id = name;
        return element;
      })
      .forEach(element => stateContainer.appendChild(element));
  }

}

export default new Component(COMPONENT_NAME, GraphicsControler);
