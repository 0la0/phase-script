import { eventBus } from 'services/EventBus';
import keyShortcutManager from 'services/keyShortcut';

class Listener {
  constructor(name, handler) {
    this.name = name;
    this.handler = handler;
  }
}

const listeners = [
  new Listener('keydown', event => keyShortcutManager.offerKeyShortcutEvent(event)),
  new Listener('mousemove', event => eventBus.publish({ address: 'MOUSE_MOVE', event })),
  new Listener('mouseup', event => eventBus.publish({ address: 'MOUSE_UP', event })),
];

export default class GlobalListeners {
  static init() {
    listeners.forEach(listener => window.addEventListener(listener.name, listener.handler));
  }

  static tearDown() {
    listeners.forEach(listener => window.removeEventListener(listener.name, listener.handler));
  }
}
