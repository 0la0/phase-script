import BaseComponent from 'common/util/base-component';
import style from './editor-tab.css';
import markup from './editor-tab.html';

export default class EditorTab extends BaseComponent {
  static get tag() {
    return 'editor-tab';
  }

  constructor(label, onClick, onRemove) {
    super(style, markup, [ 'container', 'label', 'closeButton' ]);
    this.addEventListener('click', () => onClick(this));
    this.dom.label.innerText = label;
    this.dom.closeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(this);
    });
  }

  setActive(isActive) {
    if (isActive) {
      this.dom.container.classList.add('tab-active');
    } else {
      this.dom.container.classList.remove('tab-active');
    }
    return this;
  }
}
