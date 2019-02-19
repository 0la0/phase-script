import audioGraph from 'services/audio/graph';

export default class Delay  {
  constructor (delayTime = 0, feedback = 0.8, wet = 0.6) {
    const audioContext = audioGraph.getAudioContext();
    this.input = audioContext.createDelay();
    this.feedback = audioContext.createGain();
    this.wetLevel = audioContext.createGain();
    this.input.delayTime.value = delayTime;
    this.feedback.gain.value = feedback;
    this.wetLevel.gain.value = wet;
    this.feedback.connect(this.input);
    this.input.connect(this.wetLevel);
    this.input.connect(this.feedback);
  }

  connect(node) {
    this.wetLevel.connect(node);
  }

  disconnect(node) {
    this.wetLevel.disconnect(node);
  }

  getInput() {
    return this.input;
  }

  setDelayTime(delayTime, scheduledTime) {
    if (scheduledTime) {
      this.input.delayTime.linearRampToValueAtTime(delayTime, scheduledTime);
    } else {
      this.input.delayTime.value = delayTime;
    }
  }

  setFeedback(feedback, scheduledTime) {
    if (scheduledTime) {
      this.feedback.gain.linearRampToValueAtTime(feedback, scheduledTime);
    } else {
      this.feedback.gain.setValueAtTime(feedback, 0);
    }
  }

  setWetLevel(frequency, scheduledTime) {
    if (scheduledTime) {
      this.wetLevel.gain.linearRampToValueAtTime(frequency, scheduledTime);
    } else {
      this.wetLevel.gain.setValueAtTime(frequency, 0);
    }
  }

  updateParams(delayTime, feedback, wet, time) {
    this.input.delayTime.linearRampToValueAtTime(delayTime, time);
    this.feedback.gain.linearRampToValueAtTime(feedback, time);
    this.wetLevel.gain.linearRampToValueAtTime(wet, time);
  }
}
