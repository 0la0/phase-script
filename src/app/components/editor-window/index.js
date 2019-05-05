import BaseComponent from 'common/util/base-component';
import { eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import TabWindow from './TabWindow';
import style from './editor-window.css';
import markup from './editor-window.html';

export default class EditorWindow extends BaseComponent {
  static get tag() {
    return 'editor-window';
  }

  constructor() {
    super(style, markup, [ 'addTab', 'tabContainer', 'contentContainer' ]);
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
    this.activeTab;
    this.dom.addTab.addEventListener('click', this.addTab.bind(this));
    this.tabs = [];
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
    const tabWindow = new TabWindow(label, this.dom.tabContainer, this.dom.contentContainer)
      .setHandleClick(this.handleTabClick.bind(this))
      .setHandleRemove(this.handleTabRemove.bind(this));
    this.tabs.push(tabWindow);
    this.activeTab = tabWindow;
    this.render();
  }

  handleTabClick(tab) {
    this.activeTab = tab;
    this.render();
  }

  handleTabRemove(tab) {
    this.tabs = this.tabs.filter(_tab => _tab !== tab);
    if (tab === this.activeTab) {
      this.activeTab = this.tabs[0];
    }
    this.render();
  }

  tabShift(amount) {
    if (!this.tabs.length) {
      this.render();
      return;
    }
    if (this.tabs.length === 1) {
      this.activeTab = this.tabs[0];
      this.render();
      return;
    }
    this.tabs.some((tab, index) => {
      if (tab !== this.activeTab) {
        return false;
      }
      if (amount < 0 && index === 0) {
        this.activeTab = this.tabs[this.tabs.length - 1];
      } else {
        const activeIndex = (index + amount) % this.tabs.length;
        this.activeTab = this.tabs[activeIndex];
      }
      return true;
    });
    this.render();
  }

  render() {
    requestAnimationFrame(() =>
      this.tabs.forEach(tab => tab.setActive(tab === this.activeTab)));
  }
}
