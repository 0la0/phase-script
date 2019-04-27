import BaseComponent from 'common/util/base-component';
import GlobalListeners from 'services/EventBus/GlobalListeners';
import markup from './app-entry.html';
import styles from './app-entry.css';

export default class App extends BaseComponent {
  static get tag() {
    return 'app-entry';
  }

  constructor() {
    super(styles, markup);
  }

  connectedCallback() {
    GlobalListeners.init();
  }

  disconnectedCallback() {
    GlobalListeners.tearDown();
  }
}
