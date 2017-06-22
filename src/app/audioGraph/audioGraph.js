
export default class AudioGraph {

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

  getOutput() {
    return this.masterCompressor;
  }

  static getInstance() {
    return 'hello';
  }

}
