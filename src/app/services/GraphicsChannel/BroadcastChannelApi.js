class EmptyChannel {
  cosntructor() {
    console.log('BroadcastChannel is not supported in this browser.');
  }
  postMessage() {}
}
const BroadcastChannelApi = window.BroadcastChannel || EmptyChannel;
export default BroadcastChannelApi;
