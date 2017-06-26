import EventBus from './';

let eventBus;

export default function provideEventBus() {
  if (!eventBus) {
    eventBus = new EventBus();
  }
  return eventBus;
}
