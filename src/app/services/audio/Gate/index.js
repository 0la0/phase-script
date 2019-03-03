import audioGraph from 'services/audio/graph';

export default class Gate  {
  constructor(threshold) {
    console.log('Gate construct', threshold)
    const audioContext = audioGraph.getAudioContext();
    this.gateNode = new AudioWorkletNode(audioContext, 'Gate');
    this.gateNode.port.onmessage = event => console.log('gateMsg', event.data);
    this.setThresholdAtTime(threshold);
  }

  connect(node) {
    this.gateNode.connect(node);
  }

  disconnect(node) {
    this.gateNode.disconnect(node);
  }

  getInput() {
    return this.gateNode;
  }

  setThresholdAtTime(threshold = 0.5, scheduledTime = 0) {
    console.log('setThresholdAtTime', threshold, scheduledTime)
    this.gateNode.parameters.get('threshold').setValueAtTime(threshold, scheduledTime);
    return this;
  }
}
