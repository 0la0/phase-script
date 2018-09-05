import audioGraph from 'services/audio/graph';

export default class Chorus  {
  constructor () {
    const audioContext = audioGraph.getAudioContext();
    this.input = audioContext.createGain();

    this.delayNode = audioContext.createDelay();
    this.delayNode.delayTime.value = 0.12; //delayTime

    this.feedbackGain = audioContext.createGain();
    this.feedbackGain.gain.value = 0.25; //feedback

    this.chorus = audioContext.createDelay();
    this.chorus.delayTime.value = 0.005; //chorus delay

    this.lfo = audioContext.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.1; //chorus speed

    this.lfoGain = audioContext.createGain();
    this.lfoGain.gain.value = 0.003; //chorus depth

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.chorus.delayTime);
    this.input.connect(this.delayNode);
    this.delayNode.connect(this.chorus);
    this.delayNode.connect(this.feedbackGain);
    this.chorus.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);

    this.lfo.start(0);
  }

  connect(node) {
    this.feedbackGain.connect(node);
  }

  disconnect(node) {
    this.feedbackGain.disconnect(node);
  }

  getInput() {
    return this.input;
  }

  setFeedback(feedback) {
    this.feedbackGain.gain.setValueAtTime(feedback, 0);
  }

  setFrequency(frequency) {
    this.lfo.frequency.setValueAtTime(frequency, 0);
  }

  setDepth(depth) {
    this.lfoGain.gain.setValueAtTime(depth, 0);
  }
}
