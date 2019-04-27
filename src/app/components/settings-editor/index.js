import BaseComponent from 'common/util/base-component';
import style from './settings-editor.css';
import markup from './settings-editor.html';

export default class SettingsEditor extends BaseComponent {
  static get tag() {
    return 'settings-editor';
  }

  constructor(closeCallback) {
    super(style, markup, []);
    this.handleClose = closeCallback;
  }

  handleFontSizeChange(event) {
    const fontSize = parseInt(event.target.value, 10);
    console.log('fontSize', fontSize);
  }
}
