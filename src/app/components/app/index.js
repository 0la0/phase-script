import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';

const COMPONENT_NAME = 'app-entry';
const markup = require(`./${COMPONENT_NAME}.html`);

class App extends BaseComponent {
  constructor() {
    super('', markup);
  }
}

export default new Component(COMPONENT_NAME, App);
