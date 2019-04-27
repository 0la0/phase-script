import Subscription from './Subscription';

class EventBus {
  constructor() {
    this.subscribers = [];
  }

  reset() {
    this.subscribers = [];
  }

  publish(message) {
    this.subscribers
      .filter(subscriber => subscriber.address === message.address)
      .forEach(subscriber => subscriber.onNext(message));
  }

  subscribe(subscriber) {
    if (!(subscriber instanceof Subscription)) {
      throw new Error('EventBus.subscribe must be called with a Subscription');
    }
    const hasSubscription = this.hasSubscription(subscriber);
    if (hasSubscription) {
      // eslint-disable-next-line no-console
      console.warn('Subscribed multiple times', subscriber);
      return;
    }
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter(_subscriber => _subscriber !== subscriber);
  }

  hasSubscription(subscriber) {
    return this.subscribers
      .some(_subscriber => _subscriber.equals(subscriber));
  }
}

const eventBus = new EventBus();
const audioEventBus = new EventBus();

export { eventBus, audioEventBus };
