import BaseComponent from 'common/util/base-component';
import markup from './docs-main.html';
import styles from './docs-main.css';

export default class DocsMain extends BaseComponent {
  static get tag() {
    return 'docs-main';
  }

  constructor() {
    super(styles, markup);
  }
}
