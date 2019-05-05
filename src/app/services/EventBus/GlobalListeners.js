import { eventBus } from 'services/EventBus';

const keyShortcuts = [
  { code: 'Space', ctrlKey: false, shortcut: 'KEY_SPACE' },
  { code: 'Escape', ctrlKey: false, shortcut: 'KEY_ESCAPE' },
  { code: 'BracketLeft', ctrlKey: true, shortcut: 'TAB_NAV_LEFT' },
  { code: 'BracketRight', ctrlKey: true, shortcut: 'TAB_NAV_RIGHT' },
  { code: 'KeyN', ctrlKey: true, shortcut: 'NEW_EDITOR_WINDOW' },
  { code: 'KeyT', ctrlKey: true, shortcut: 'NEW_EDITOR_WINDOW' },
];

function isKeyMatch(event, keyEvent) {
  return event.code === keyEvent.code && event.ctrlKey === keyEvent.ctrlKey;
}

function keyDownHandler(event) {
  keyShortcuts.forEach(keyEvent => {
    if (!isKeyMatch(event, keyEvent)) { return; }
    eventBus.publish({ address: 'KEY_SHORTCUT', shortcut: keyEvent.shortcut, event });
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
