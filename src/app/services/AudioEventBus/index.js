
class AudioEventBus {
  constructor() {
    this.subscribers = new Set();
  }

  publish(message) {
    [...this.subscribers]
      .filter(subscriber => subscriber.address === message.address)
      .forEach(subscriber => subscriber.onNext(message));
  }

  subscribe(subscriber) {
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
}

const audioEventBus = new AudioEventBus();
export default audioEventBus;
