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
    const tab = new EditorTab(label, this.handleTabClick.bind(this), this.handleTabRemove.bind(this));
    const component = new EventCycle();
    tab.classList.add('tab');
    this.dom.tabContainer.appendChild(tab);
    component.classList.add('editor');
    this.dom.contentContainer.appendChild(component);
    this.activeTab = tab;
    requestAnimationFrame(() => this.render());
  }

  handleTabClick(tab) {
    this.activeTab = tab;
    requestAnimationFrame(() => this.render());
  }

  handleTabRemove(tab) {
    [...this.dom.tabContainer.children].forEach((tabElement, index) => {
      if (tabElement === tab) {
        const editorElement = [...this.dom.contentContainer.children][index];
        this.dom.tabContainer.removeChild(tabElement);
        this.dom.contentContainer.removeChild(editorElement);
      }
    });
    this.activeTab = [...this.dom.tabContainer.children][0];
    requestAnimationFrame(() => this.render());
  }

  tabShift(amount) {
    const tabs = [...this.dom.tabContainer.children];
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i] === this.activeTab) {
        if (i === 0 && amount < 0) {
          this.activeTab = tabs[tabs.length - 1];
        } else {
          const activeIndex = (i + amount) % tabs.length;
          this.activeTab = tabs[activeIndex];
        }
        break;
      }
    }
    requestAnimationFrame(() => this.render());
  }

  render() {
    [...this.dom.tabContainer.children].forEach((tabElement, index) => {
      const editorElement = [...this.dom.contentContainer.children][index];
      if (tabElement === this.activeTab) {
        tabElement.classList.add('tab-active');
        editorElement.classList.add('editor-active');
      } else {
        tabElement.classList.remove('tab-active');
        editorElement.classList.remove('editor-active');
      }
    });
  }
}
