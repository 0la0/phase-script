import audioGraph from 'services/audio/graph';

export default class Visualizer {
  constructor () {
    this.analyser = audioGraph.getAudioContext().createAnalyser();
    this.analyser.fftSize = Math.pow(2, 11);
    const bufferLength = this.analyser.frequencyBinCount;
    this.timeDataArray = new Uint8Array(bufferLength);
    this.freqDataArray = new Uint8Array(bufferLength);
    this.sampleRate = audioGraph.getAudioContext().sampleRate;
  }

  connect(node) {
    node.connect(this.analyser);
  }

  disconnect(node) {
    node.disconnect(this.analyser);
  }

  getInput() {
    return this.analyser;
  }

  getBufferLength () {
    return this.analyser.frequencyBinCount;
  }

  getTimeData () {
    this.analyser.getByteTimeDomainData(this.timeDataArray);
    return this.timeDataArray;
  }

  getFrequencyData () {
    this.analyser.getByteFrequencyData(this.freqDataArray);
    return this.freqDataArray;
  }

  getCachedFrequencyData() {
    return this.freqDataArray;
  }

  getHzPerBin () {
    // note that the number of bins is half the fftSize
    return this.sampleRate / this.analyser.fftSize;
  }
}
