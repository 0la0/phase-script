import audioGraph from 'services/audio/graph';

class Visualizer {

  constructor () {
    this.source = audioGraph.getOutput();
    this.analyser = audioGraph.getAudioContext().createAnalyser();
    this.analyser.fftSize = Math.pow(2, 11);
    this.timeDataArray = new Uint8Array(this.getBufferLength());
    this.freqDataArray = new Uint8Array(this.getBufferLength());
    this.sampleRate = audioGraph.getAudioContext().sampleRate;
    this.connect();
  }

  connect () {
    this.source.connect(this.analyser);
  }

  disconnect () {
    this.source.disconnect(this.analyser);
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

const visualizer = new Visualizer();
export default visualizer;
