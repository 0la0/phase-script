import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import router from 'services/Router';
import markup from './app-entry.html';
import styles from './app-entry.css';

class App extends BaseComponent {
  constructor() {
    super(styles, markup);
  }

  goToSoundRoute() {
    router.pushRoute('/#/sound');
  }

  goToGraphicsRoute() {
    router.pushRoute('/#/graphics');
  }
}

export default new Component('app-entry', App);
