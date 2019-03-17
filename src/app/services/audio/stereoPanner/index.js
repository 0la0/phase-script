import audioGraph from 'services/audio/graph';

export default class StereoPanner  {
  constructor (panValue) {
    const audioContext = audioGraph.getAudioContext();
    this.panNode = audioContext.createStereoPanner();
    this.panNode.pan.value = panValue || 0;
  }

  connect(node) {
    this.panNode.connect(node);
  }

  disconnect(node) {
    this.panNode.disconnect(node);
  }

  getInput() {
    return this.panNode;
  }

  setPanValue(panValue, scheduledTime) {
    this.panNode.pan.linearRampToValueAtTime(panValue, scheduledTime);
    return this;
  }

  getPanParam() {
    return this.panNode.pan;
  }
}
