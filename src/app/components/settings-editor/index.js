import BaseComponent from 'common/util/base-component';
import dataStore from 'services/Store';
import version from 'common/util/version';
import style from './settings-editor.css';
import markup from './settings-editor.html';

export default class SettingsEditor extends BaseComponent {
  static get tag() {
    return 'settings-editor';
  }

  constructor(closeCallback) {
    super(style, markup, [ 'version', ]);
    this.handleClose = closeCallback;
    this.dom.version.innerText = version;
  }

  handleFontSizeChange(event) {
    const fontSize = parseInt(event.target.value, 10);
    dataStore.setValue({ fontSize });
  }
}
