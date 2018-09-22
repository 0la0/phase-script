class EmptyChannel {
  cosntructor() {
    console.log('BroadcastChannel is not supported in this browser.')
  }
  postMessage() {}
}
const Channel = window.BroadcastChannel || EmptyChannel;
const graphicsChannel = new Channel('GRAPHICS_CHANNEL');

export default graphicsChannel;
