export default class Subscription {
  constructor(address, onNext) {
    this.address = address || '-';
    this.onNext = onNext || (() => {});
  }

  setAddress(address) {
    this.address = address;
    return this;
  }

  setOnNext(onNext) {
    this.onNext = onNext;
    return this;
  }

  equals(subscription) {
    return this === subscription
      || this.address === subscription.address
      && this.onNext === subscription.onNext;
  }
}
