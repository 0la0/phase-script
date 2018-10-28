import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import router from 'services/Router';

const COMPONENT_NAME = 'app-entry';
const markup = require(`./${COMPONENT_NAME}.html`);

class App extends BaseComponent {
  constructor() {
    super('', markup);
  }

  goToSoundRoute() {
    router.pushRoute('/#/sound');
  }

  goToGraphicsRoute() {
    router.pushRoute('/#/graphics');
  }
}

export default new Component(COMPONENT_NAME, App);
