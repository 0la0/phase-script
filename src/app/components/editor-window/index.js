import BaseComponent from 'common/util/base-component';
import EventCycle from 'components/event-cycle';
import { eventBus } from 'services/EventBus';
import Subscription from 'services/EventBus/Subscription';
import style from './editor-window.css';
import markup from './editor-window.html';

export default class EditorWindow extends BaseComponent {
  static get tag() {
    return 'editor-window';
  }

  constructor() {
    super(style, markup, [ 'eventCycleContainer' ]);
    this.newEditorSubscription = new Subscription('NEW_EDITOR_WINDOW', this.onAddCycle.bind(this));
  }

  connectedCallback() {
    eventBus.subscribe(this.newEditorSubscription);
  }

  disconnectedCallback() {
    eventBus.unsubscribe(this.newEditorSubscription);
  }

  onAddCycle() {
    const parentElement = this.dom.eventCycleContainer;
    const component = new EventCycle();
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }
}
