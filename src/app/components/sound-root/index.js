import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import EventNetwork from 'components/event-network';
import EventCycle from 'components/event-cycle';
import PatchSpace from 'components/patch-space';

const COMPONENT_NAME = 'sound-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const dom = [ 'eventNetworkContainer', 'eventCycleContainer', 'patchContainer' ];

class SoundRoot extends BaseComponent {
  constructor() {
    super(style, markup, dom);
  }

  addElement(parentElement, ComponentClass) {
    const component = new ComponentClass();
    component.setOnRemoveCallback(() => parentElement.removeChild(component));
    parentElement.appendChild(component);
  }

  onAddEventNetwork() {
    this.addElement(this.dom.eventNetworkContainer, EventNetwork.element);
  }

  onAddCycle() {
    this.addElement(this.dom.eventCycleContainer, EventCycle.element);
  }

  onAddPatchSpace() {
    this.addElement(this.dom.patchContainer, PatchSpace.element);
  }
}

export default new Component(COMPONENT_NAME, SoundRoot);
