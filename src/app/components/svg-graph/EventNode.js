import BaseNode from './BaseNode';
import SvgCircleNode from './SvgCircleNode';
import { NODE_RADIUS } from './Constants';

// TODO: MOVE TO EVENT NETWORK
export default class EventNode extends BaseNode {
  constructor(x, y, parentElement, getAllNodes, openMenu) {
    super(x, y, parentElement, getAllNodes, openMenu);
    this.svgNode = new SvgCircleNode(NODE_RADIUS);
    this.init(x, y);
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
      this.edges.map(edge => edge.getEndNode())
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

  getActivationThreshold(activationThreshold) {
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
}
