export default class KeyShortcut {
  constructor({ keyCode, ctrlKey, address, }) {
    this.keyCode = keyCode;
    this.ctrlKey = ctrlKey;
    this.address = address;
  }

  matchesKeyEvent(keyEvent) {
    return keyEvent.code === this.keyCode
      && keyEvent.ctrlKey === this.ctrlKey;
  }
}
