import BaseComponent from 'common/util/base-component';
import style from './editor-tab.css';
import markup from './editor-tab.html';

export default class EditorTab extends BaseComponent {
  static get tag() {
    return 'editor-tab';
  }

  constructor(label, onClick, onRemove) {
    super(style, markup, [ 'label', 'closeButton' ]);
    this.addEventListener('click', onClick);
    this.dom.label.innerText = label;
    this.dom.closeButton.addEventListener('click', onRemove);
  }
}
