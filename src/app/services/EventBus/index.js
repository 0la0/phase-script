
export default class EventBus {

  constructor() {
    this.subscribers = new Set();
  }

  publish(message) {
    Array.from(this.subscribers)
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
