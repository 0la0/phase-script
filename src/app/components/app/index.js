import BaseComponent from 'common/util/base-component';
import markup from './app-entry.html';
import styles from './app-entry.css';

export default class App extends BaseComponent {
  static get tag() {
    return 'app-entry';
  }

  constructor() {
    super(styles, markup);
  }
}
