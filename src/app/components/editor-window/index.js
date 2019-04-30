import BaseComponent from 'common/util/base-component';
import EventCycle from 'components/event-cycle';
import EditorTab from './editor-tab';
import { eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import style from './editor-window.css';
import markup from './editor-window.html';

export default class EditorWindow extends BaseComponent {
  static get tag() {
    return 'editor-window';
  }

  constructor() {
    super(style, markup, [ 'tabContainer', 'contentContainer' ]);
    this.keyShortcutSubscription = new Subscription('KEY_SHORTCUT', (msg) => {
      if (msg.shortcut === 'TAB_NAV_LEFT') {
        this.tabShift(-1);
        return;
      }
      if (msg.shortcut === 'TAB_NAV_RIGHT') {
        this.tabShift(1);
        return;
      }
      if (msg.shortcut === 'NEW_EDITOR_WINDOW') {
        this.addTab();
      }
    });
    this.activeTab = 0;
  }

  connectedCallback() {
    eventBus.subscribe(this.keyShortcutSubscription);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.keyShortcutSubscription);
  }

  addTab() {
    const index = this.dom.tabContainer.children.length;
    const label = `tab${index + 1}`;
    const tab = new EditorTab(label, () => this.handleTabClick(index));
    tab.classList.add('tab');
    const parentElement = this.dom.contentContainer;
    const component = new EventCycle();
    this.dom.tabContainer.appendChild(tab);
    component.classList.add('editor');
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
    requestAnimationFrame(() => this.render());
  }

  handleTabClick(index) {
    this.activeTab = index;
    requestAnimationFrame(() => this.render());
  }

  tabShift(amount) {
    if (this.activeTab === 0 && amount < 1) {
      this.activeTab = this.dom.tabContainer.children.length - 1;
    } else {
      this.activeTab = (this.activeTab + amount) % this.dom.tabContainer.children.length;
    }
    requestAnimationFrame(() => this.render());
  }

  render() {
    [...this.dom.tabContainer.children].forEach((tabElement, index) => {
      if (index === this.activeTab) {
        tabElement.classList.add('tab-active');
      } else {
        tabElement.classList.remove('tab-active');
      }
    });

    [...this.dom.contentContainer.children].forEach((editorElement, index) => {
      if (index === this.activeTab) {
        editorElement.classList.add('editor-active');
      } else {
        editorElement.classList.remove('editor-active');
      }
    });
  }
}
