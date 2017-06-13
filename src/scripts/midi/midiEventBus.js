class MidiEventBus {

  constructor () {
    this.activeListener;
    this.listenerMap = new Map();
  }

  registerActiveListener (listener) {
    this.activeListener = listener;
  }

  deregisterActiveListener (listener) {
    if (this.activeListener && this.activeListener === listener) {
      this.activeListener = null;
    }
  }

  onMidiMessage (event) {
    const message = getObjectFromMessage(event.data);
    this.onMessage(message.command, message.status, message.note, message.value);
  }

  onMessage (command, status, note, value) {
    const mapKey = `${status}_${note}`;
    if (this.activeListener) {
      this.listenerMap.set(mapKey, this.activeListener);
      this.activeListener.isRegistered = true;
      this.activeListener.setBoundMidiData(command, status, note, value);
    }
    else {
      if (this.listenerMap.get(mapKey)) {
        console.log('send to listener: ', command, status, note, value);
        this.listenerMap.get(mapKey)
          .onMessage(command, status, note, value);
      }
    }
  }

}

function getMessageFromObject (messageObject) {
  return new Uint8Array([
    (messageObject.command << 4) | messageObject.status,
    messageObject.note,
    messageObject.value
  ]);
}

function getObjectFromMessage (midiMessage) {
  return {
    command: (midiMessage[0] & '0xF0') >>> 4,
    status: midiMessage[0] & '0xF',
    note: midiMessage[1],
    value: midiMessage[2]
  };
}

function buildMidiEventBus () {
  return new MidiEventBus();
}

export {buildMidiEventBus, getObjectFromMessage, getMessageFromObject};
