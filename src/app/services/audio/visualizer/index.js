import audioGraph from 'services/audio/graph';

export default class Visualizer {
  constructor () {
    const timeBuffer = 2 ** 11;
    const freqBuffer = 2 ** 8;
    this.timeAnalyser = audioGraph.getAudioContext().createAnalyser();
    this.freqAnalyser = audioGraph.getAudioContext().createAnalyser();
    this.timeAnalyser.fftSize = timeBuffer;
    this.freqAnalyser.fftSize = freqBuffer;
    this.timeDataArray = new Uint8Array(timeBuffer);
    this.freqDataArray = new Uint8Array(freqBuffer);
    this.sampleRate = audioGraph.getAudioContext().sampleRate;
  }

  connect(node) {
    node.connect(this.timeAnalyser);
    node.connect(this.freqAnalyser);
  }

  disconnect(node) {
    node.disconnect(this.timeAnalyser);
    node.disconnect(this.freqAnalyser);
  }

  getInput() {
    return this.analyser;
  }

  getTimeData() {
    this.timeAnalyser.getByteTimeDomainData(this.timeDataArray);
    return this.timeDataArray;
  }

  getFrequencyData() {
    this.freqAnalyser.getByteFrequencyData(this.freqDataArray);
    return this.freqDataArray;
  }
}
