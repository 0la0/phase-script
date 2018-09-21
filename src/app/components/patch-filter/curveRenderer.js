import audioGraph from 'services/audio/graph';

const DB_SCALE = 60;
const NUM_OCTAVES = 11;
const FILL_COLOR = '#999';
const NYQUIST_FREQ = 0.5 * audioGraph.getSampleRate();

export default class FilterCurveRenderer {
  constructor(graphicsContext, width, height, filterModel) {
    this.width = width;
    this.height = height;
    this.graphicsContext = graphicsContext;
    this.filterModel = filterModel;
    this.frequencyHz = new Float32Array(this.width);
    this.magResponse = new Float32Array(this.width);
    this.phaseResponse = new Float32Array(this.width);
    this.pixelsPerDb = (0.5 * this.height) / DB_SCALE;
  }

  render() {
    this.graphicsContext.clearRect(0, 0, this.width, this.height);
    this.graphicsContext.fillStyle = FILL_COLOR;
    for (let i = 0; i < this.width; ++i) {
      const f = i / this.width;
      // Convert to log frequency scale (octaves)
      this.frequencyHz[i] = NYQUIST_FREQ * Math.pow(2.0, NUM_OCTAVES * (f - 1.0));
    }
    this.filterModel.getFrequencyResponse(this.frequencyHz, this.magResponse, this.phaseResponse);
    for (let i = 0; i < this.width; i++) {
      const dbResponse = 20.0 * Math.log(this.magResponse[i]) / Math.LN10;
      const top = (0.5 * this.height) - this.pixelsPerDb * dbResponse;
      this.graphicsContext.fillRect(i, top, 1, this.height);
    }
  }
}
