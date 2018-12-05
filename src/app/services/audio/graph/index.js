class AudioGraph {
  constructor () {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioCtx();
    this.masterCompressor = this.audioContext.createDynamicsCompressor();
    this.masterCompressor.connect(this.audioContext.destination);
  }

  startContext() {
    if (this.audioContext.state === 'running') {
      return Promise.resolve();
    }
    return this.audioContext.resume();
  }

  getCurrentTime () {
    return this.audioContext.currentTime;
  }

  getAudioContext () {
    return this.audioContext;
  }

  getSampleRate() {
    return this.audioContext.sampleRate;
  }

  getOutput() {
    return this.masterCompressor;
  }
}

export default new AudioGraph();
