class ThresholdEventProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'threshold',
        defaultValue: 0.5,
        minValue: 0.05,
        maxValue: 1
      }
    ];
  }

  constructor(options) {
    super(options);
    this.meterSmoothingFactor = 0.9;
    this.meterMinimum = 0.00001;
    this._lastVolume = 0;
    this._volume = 0;
    this.defaultMsg = '';
  }

  process (inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const { threshold } = parameters;
    const thresholdVal = threshold[0];
    // TODO: multi-input & channel
    if (input.length > 0) {
      let buffer = input[0];
      let bufferLength = buffer.length;
      let sumSquared = 0;
      let x = 0;
      let rootMeanSquared = 0;
      for (let i = 0; i < bufferLength; ++i) {
        x = buffer[i];
        sumSquared += x * x;
      }
      rootMeanSquared = bufferLength === 0 ? 0 : Math.sqrt(sumSquared / bufferLength);
      this._volume = Math.max(rootMeanSquared, this._volume * this.meterSmoothingFactor);
    }
    if (this._volume >= thresholdVal && this._lastVolume < thresholdVal) {
      this.port.postMessage(this.defaultMsg);
    }
    this._lastVolume = this._volume;
    for (let channel = 0; channel < input.length; ++channel) {
      for (let i = 0; i < input[channel].length; ++i) {
        output[channel][i] = input[channel][i];
      }
    }
    return true;
  }
}
registerProcessor('ThresholdEventProcessor', ThresholdEventProcessor);
