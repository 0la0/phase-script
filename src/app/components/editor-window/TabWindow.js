import EventCycle from 'components/event-cycle';
import EditorTab from './editor-tab';

export default class TabWindow {
  constructor(label, tabContainer, windowContainer) {
    this.tabContainer = tabContainer;
    this.windowContainer = windowContainer;

    this.tab = new EditorTab(label, this.handleTabClick.bind(this), this.handleTabRemove.bind(this));
    this.window = new EventCycle();

    this.tab.classList.add('tab');
    this.window.classList.add('editor');
    this.tabContainer.appendChild(this.tab);
    this.windowContainer.appendChild(this.window);
  }

  setActive(isActive) {
    this.tab.setActive(isActive);
    isActive ?
      this.window.classList.add('editor-active') :
      this.window.classList.remove('editor-active');
  }

  _removeSelf() {
    this.tabContainer.removeChild(this.tab);
    this.windowContainer.setHandleRemove(this.window);
  }

  setHandleClick(onClick) {
    this.onClick = onClick;
    return this;
  }

  handleTabClick() {
    this.onClick(this);
  }

  setHandleRemove(onRemove) {
    this.onRemove = onRemove;
    return this;
  }

  handleTabRemove() {
    this._removeSelf();
    this.onRemove(this);
  }
}
