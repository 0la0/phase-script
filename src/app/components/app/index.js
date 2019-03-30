import BaseComponent from 'components/_util/base-component';
import router from 'services/Router';
import markup from './app-entry.html';
import styles from './app-entry.css';

export default class App extends BaseComponent {
  static get tag() {
    return 'app-entry';
  }

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
