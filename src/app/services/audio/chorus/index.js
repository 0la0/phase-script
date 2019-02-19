import audioGraph from 'services/audio/graph';

export default class Chorus  {
  constructor (frequency = 0.1, depth = 0.003, feedback = 0.25) {
    const audioContext = audioGraph.getAudioContext();
    this.input = audioContext.createGain();

    this.delayNode = audioContext.createDelay();
    this.delayNode.delayTime.value = 0.12; //delayTime

    this.feedbackGain = audioContext.createGain();
    this.feedbackGain.gain.value = feedback; //feedback

    this.chorus = audioContext.createDelay();
    this.chorus.delayTime.value = 0.005; //chorus delay

    this.lfo = audioContext.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = frequency; //chorus speed

    this.lfoGain = audioContext.createGain();
    this.lfoGain.gain.value = depth; //chorus depth

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

  setFeedback(feedback, scheduledTime) {
    if (scheduledTime) {
      this.feedbackGain.gain.linearRampToValueAtTime(feedback, scheduledTime);
    } else {
      this.feedbackGain.gain.setValueAtTime(feedback, 0);
    }
  }

  setFrequency(frequency, scheduledTime) {
    if (scheduledTime) {
      this.lfo.frequency.linearRampToValueAtTime(frequency, scheduledTime);
    } else {
      this.lfo.frequency.setValueAtTime(frequency, 0);
    }
  }

  setDepth(depth, scheduledTime) {
    if (scheduledTime) {
      this.lfoGain.gain.linearRampToValueAtTime(depth, scheduledTime);
    } else {
      this.lfoGain.gain.setValueAtTime(depth, 0);
    }
  }

  updateParams(frequency, depth, feedback, scheduledTime) {
    this.lfo.frequency.linearRampToValueAtTime(frequency, scheduledTime);
    this.lfoGain.gain.linearRampToValueAtTime(depth, scheduledTime);
    this.feedbackGain.gain.linearRampToValueAtTime(feedback, scheduledTime);
  }
}
