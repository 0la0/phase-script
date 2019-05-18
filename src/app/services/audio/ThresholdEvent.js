import audioGraph from 'services/audio/Graph';

export default class ThresholdEventProcessor  {
  constructor(threshold, thresholdEventCallback) {
    const audioContext = audioGraph.getAudioContext();
    this.thresholdNode = new AudioWorkletNode(audioContext, 'ThresholdEventProcessor');
    this.thresholdNode.port.onmessage = thresholdEventCallback;
    this.setThresholdAtTime(threshold);
  }

  connect(node) {
    this.thresholdNode.connect(node);
  }

  disconnect(node) {
    this.thresholdNode.disconnect(node);
  }

  getInput() {
    return this.thresholdNode;
  }

  setThresholdAtTime(threshold = 0.5, scheduledTime = 0) {
    this.thresholdNode.parameters.get('threshold').setValueAtTime(threshold, scheduledTime);
    return this;
  }
}
