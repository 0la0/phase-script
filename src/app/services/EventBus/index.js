
const EMPTY_SUBSCRIPTION = { address: '-', onNext: () => {} };

class EventBus {
  constructor() {
    this.subscribers = new Set([ EMPTY_SUBSCRIPTION ]);
  }

  publish(message) {
    [...this.subscribers]
      .filter(subscriber => subscriber.address === message.address)
      .forEach(subscriber => subscriber.onNext(message));
  }

  subscribe(subscriber) {
    const hasSubscription = this.hasSubscription(subscriber.address, subscriber.onNext);
    if (hasSubscription) {
      console.log('Cannot subscribe multiple times:', subscriber)
      return;
    }
    this.subscribers.add(subscriber);
    this.onNewSubscription();
  }

  unsubscribe(subscriber) {
    this.subscribers.delete(subscriber);
    this.onNewSubscription();
  }

  onNewSubscription() {
    const addresses = this.getAddresses();
    [...this.subscribers]
      .filter(subscriber => subscriber.onNewSubscription)
      .forEach(subscriber => subscriber.onNewSubscription(addresses));
  }

  getAddresses() {
    return [...this.subscribers]
      .filter(subscriber => subscriber.address)
      .map(subscriber => subscriber.address);
  }

  hasSubscription(address, onNext) {
    return [...this.subscribers]
      .some(subscriber => subscriber.address === address && subscriber.onNext === onNext);
  }
}

const eventBus = new EventBus();
const audioEventBus = new EventBus();
const tickEventBus = new EventBus();

export {
  eventBus,
  audioEventBus,
  tickEventBus
}
