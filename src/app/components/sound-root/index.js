import BaseComponent from 'common/util/base-component';
import EventCycle from 'components/event-cycle';
import style from './sound-root.css';
import markup from './sound-root.html';

const dom = [ 'eventCycleContainer', ];

export default class SoundRoot extends BaseComponent {
  static get tag() {
    return 'sound-root';
  }

  constructor() {
    super(style, markup, dom);
  }

  onAddCycle() {
    const parentElement = this.dom.eventCycleContainer;
    const component = new EventCycle();
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }
}
