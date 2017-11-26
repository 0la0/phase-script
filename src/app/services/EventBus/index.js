
class EventBus {
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
  }

  unsubscribe(subscriber) {
    this.subscribers.delete(subscriber);
  }
}

const eventBus = new EventBus();
export default eventBus;
