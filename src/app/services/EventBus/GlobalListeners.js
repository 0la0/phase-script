import { eventBus } from 'services/EventBus';

const keyEvents = [
  { code: 'Space', metaKey: false, address: 'KEY_SPACE' },
];

function isKeyMatch(event, keyEvent) {
  return event.code === keyEvent.code && event.metaKey === keyEvent.metaKey;
}

function keyHandler(event) {
  keyEvents.forEach(keyEvent => {
    if (!isKeyMatch(event, keyEvent)) { return; }
    eventBus.publish({ address: keyEvent.address, event });
  });
}

class Listener {
  constructor(name, handler) {
    this.name = name;
    this.handler = handler;
  }
}

const listeners = [
  // new Listener('mousemove', event => eventBus.publish({ address: 'MOUSE_MOVE', event })),
  // new Listener('mouseup', event => eventBus.publish({ address: 'MOUSE_UP', event })),
  new Listener('keydown', keyHandler),
];

export default class GlobalListeners {
  static init() {
    listeners.forEach(listener => window.addEventListener(listener.name, listener.handler));
  }

  static tearDown() {
    listeners.forEach(listener => window.removeEventListener(listener.name, listener.handler));
  }
}
