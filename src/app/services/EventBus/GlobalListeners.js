import { eventBus } from 'services/EventBus';

// TODO: change to { address: key_shortcut }
const keyEvents = [
  { code: 'Space', ctrlKey: false, address: 'KEY_SPACE' },
  { code: 'Escape', ctrlKey: false, address: 'KEY_ESCAPE' },
  { code: 'BracketLeft', ctrlKey: true, address: 'TAB_NAV_LEFT' },
  { code: 'BracketRight', ctrlKey: true, address: 'TAB_NAV_RIGHT' },
  { code: 'KeyN', ctrlKey: true, address: 'NEW_EDITOR_WINDOW' },
  { code: 'KeyT', ctrlKey: true, address: 'NEW_EDITOR_WINDOW' },
];

function isKeyMatch(event, keyEvent) {
  return event.code === keyEvent.code && event.ctrlKey === keyEvent.ctrlKey;
}

function keyDownHandler(event) {
  console.log(event)
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
  new Listener('keydown', keyDownHandler),
];

export default class GlobalListeners {
  static init() {
    listeners.forEach(listener => window.addEventListener(listener.name, listener.handler));
  }

  static tearDown() {
    listeners.forEach(listener => window.removeEventListener(listener.name, listener.handler));
  }
}
