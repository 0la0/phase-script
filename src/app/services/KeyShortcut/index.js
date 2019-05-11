import { eventBus } from 'services/EventBus';
import KeyShortcut from './KeyShortcut';

class KeyShortcutManager {
  constructor() {
    this.keyShortcuts = [
      new KeyShortcut({ keyCode: 'Space', ctrlKey: true, address: 'KEY_SPACE' }),
      new KeyShortcut({ keyCode: 'Escape', ctrlKey: false, address: 'KEY_ESCAPE' }),
      new KeyShortcut({ keyCode: 'BracketLeft', ctrlKey: true, address: 'TAB_NAV_LEFT' }),
      new KeyShortcut({ keyCode: 'BracketRight', ctrlKey: true, address: 'TAB_NAV_RIGHT' }),
      new KeyShortcut({ keyCode: 'KeyN', ctrlKey: true, address: 'NEW_EDITOR_WINDOW' }),
      new KeyShortcut({ keyCode: 'KeyT', ctrlKey: true, address: 'NEW_EDITOR_WINDOW' }),
    ];
  }

  offerKeyShortcutEvent(event) {
    const keyShortcut = this.keyShortcuts.find(keyShortcut => keyShortcut.matchesKeyEvent(event));
    if (!keyShortcut) {
      return false;
    }
    eventBus.publish({ address: 'KEY_SHORTCUT', shortcut: keyShortcut.address, event });
    return true;
  }
}

const keyShortcutManager = new KeyShortcutManager();
export default keyShortcutManager;
