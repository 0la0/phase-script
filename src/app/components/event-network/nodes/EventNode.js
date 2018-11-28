import BaseNode from 'components/event-network/svg-graph/BaseNode';
import PropertyMenu from 'components/event-network/property-menu';

export default class EventNode extends BaseNode {
  constructor(x, y, parentElement, getAllNodes, onDelete) {
    super(x, y, 'CIRCLE', parentElement, getAllNodes, onDelete);
    this.activationThreshold = 4;
    this.activationCnt = 0;
    this.messageValue = 60;
    this.isActivated = false;
  }

  onBeforeActivate() {
    if (!this.isActivated) { return; }
    this.activationCnt = 0;
    this.isActivated = false;
  }

  activate(tickNumber, time) {
    this.activationCnt++;
    if (this.activationCnt === this.activationThreshold) {
      this.edges
        .map(edge => edge.getEndNode())
        .forEach(outputNode => outputNode.activate(tickNumber, time));
      this.isActivated = true;
      if (this.action) {
        this.action(time);
      }
    }
  }

  renderActivationState() {
    this.svgNode.renderActivation(this.isActivated);
  }

  setAction(action) {
    this.action = action;
  }

  setActivationThreshold(activationThreshold) {
    this.activationThreshold = activationThreshold;
  }

  getActivationThreshold() {
    return this.activationThreshold;
  }

  setAddress(address) {
    this.address = address;
    this.svgNode.setActive(address !== '-');
  }

  getAddress() {
    return this.address;
  }

  setMessageValue(messageValue) {
    this.messageValue = messageValue;
  }

  getMessageValue() {
    return this.messageValue;
  }

  onRightClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const container = this.parentElement.parentElement;
    const propertyMenu = new PropertyMenu.element(this);
    container.appendChild(propertyMenu);
  }
}
