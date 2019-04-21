import BaseComponent from 'common/util/base-component';
import style from './sample-editor.css';
import markup from './sample-editor.html';

export default class SampleEditor extends BaseComponent {
  static get tag() {
    return 'sample-editor';
  }

  constructor(closeCallback) {
    super(style, markup, []);
    this.handleClose = closeCallback;
  }
}
