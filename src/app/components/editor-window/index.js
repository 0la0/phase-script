import BaseComponent from 'common/util/base-component';
import EventCycle from 'components/event-cycle';
import { eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import style from './editor-window.css';
import markup from './editor-window.html';

function buildTabElement(label, onClick) {
  const tab = document.createElement('div');
  const tabLabel = document.createElement('p');
  tab.classList.add('tab');
  tabLabel.innerText = label;
  tab.appendChild(tabLabel);
  tab.addEventListener('click', onClick);
  return tab;
}

export default class EditorWindow extends BaseComponent {
  static get tag() {
    return 'editor-window';
  }

  constructor() {
    super(style, markup, [ 'tabContainer', 'contentContainer' ]);
    this.newEditorSubscription = new Subscription('NEW_EDITOR_WINDOW', this.onAddCycle.bind(this));
    this.tabNavLeft = new Subscription('TAB_NAV_LEFT', () => this.tabShift(-1));
    this.tabNavRight = new Subscription('TAB_NAV_RIGHT', () => this.tabShift(1));
    this.activeTab = 0;
  }

  connectedCallback() {
    eventBus.subscribe(this.newEditorSubscription);
    eventBus.subscribe(this.tabNavLeft);
    eventBus.subscribe(this.tabNavRight);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.newEditorSubscription);
    eventBus.unsubscribe(this.tabNavLeft);
    eventBus.unsubscribe(this.tabNavRight);
  }

  onAddCycle() {
    const index = this.dom.tabContainer.children.length;
    const label = `tab${index + 1}`;
    const tab = buildTabElement(label, () => this.handleTabClick(index));
    this.dom.tabContainer.appendChild(tab);
    requestAnimationFrame(() => this.render());

    const parentElement = this.dom.contentContainer;
    const component = new EventCycle();
    component.classList.add('editor');
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }

  handleTabClick(index) {
    this.activeTab = index;
    requestAnimationFrame(() => this.render());
  }

  tabShift(amount) {
    console.log('amt', amount, this.activeTab)
    if (this.activeTab === 0 && amount < 1) {
      this.activeTab = this.dom.tabContainer.children.length - 1;
    } else {
      this.activeTab = (this.activeTab + amount) % this.dom.tabContainer.children.length;
    }
    this.render();
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
