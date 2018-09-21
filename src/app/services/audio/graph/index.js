
class AudioGraph {
  constructor () {
    this.audioContext = new AudioContext();
    this.masterCompressor = this.audioContext.createDynamicsCompressor();
    this.masterCompressor.connect(this.audioContext.destination);
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

const audioGraph = new AudioGraph();
export default audioGraph;
