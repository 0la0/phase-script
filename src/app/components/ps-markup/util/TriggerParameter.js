import Subscription from 'services/EventBus/Subscription';
import { audioEventBus } from 'services/EventBus';

const PARENTHESES = /\(([^)]+)\)/;

export default class TriggerParameter {
  constructor({ attrName, element, eventHandler, }) {
    this.attrName = attrName;
    this.element = element;
    this.eventHandler = eventHandler;
    setTimeout(() => this.setValue(element.getAttribute(attrName)));
  }

  disconnect() {
    this._teardownPreviousConnections();
    this.element = null;
    this.audioEventSubscription = null;
  }

  _teardownPreviousConnections() {
    if (this.audioEventSubscription) {
      audioEventBus.unsubscribe(this.audioEventSubscription);
    }
  }

  setValue(val) {
    console.log('setting trigger value', val)
    this._teardownPreviousConnections();
    if (!val) {
      return;
    } 
    const match = val.match(PARENTHESES);
    const address = match ? match[1] : val;
    console.log('new Address', address);
    this.audioEventSubscription = new Subscription()
      .setAddress(address)
      .setOnNext(this.eventHandler);
    audioEventBus.subscribe(this.audioEventSubscription);
  }
}