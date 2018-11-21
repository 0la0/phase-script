import BroadcastChannelApi from './BroadcastChannelApi';

const GRAPHICS_CHANNEL = 'GRAPHICS_CHANNEL';
const MESSAGE = {
  SYNC: 'SYNC',
  GRAPHICS_MODE: 'GRAPHICS_MODE',
  TICK: 'TICK',
};

class GraphicsChannel {
  constructor() {
    this.channel = new BroadcastChannelApi(GRAPHICS_CHANNEL);
    this.subscribers = new Set();
    this.channel.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    const { type, value } = event.data;
    this.subscribers.forEach((subscriber) => {
      if (subscriber.address !== type) { return; }
      subscriber.onNext(value);
    });
  }

  // TODO: move to consumer
  subscribe(subscriber) {
    this.subscribers.add(subscriber);
  }

  // TODO: move to consumer
  unsubscribe(subscriber) {
    this.subscribers.delete(subscriber);
  }

  // TODO: move to producer
  sync() {
    this.channel.postMessage({ type: MESSAGE.SYNC, value: performance.now() });
  }

  // TODO: move to producer
  setMode(graphicsMode) {
    this.channel.postMessage({ type: MESSAGE.GRAPHICS_MODE, value: graphicsMode });
  }

  // TODO: move to producer
  tick(time) {
    this.channel.postMessage({ type: MESSAGE.TICK, value: time })
  }
}

const graphicsChannel = new GraphicsChannel();
export default graphicsChannel;
