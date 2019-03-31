class Gate extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'threshold',
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1
      }
    ];
  }

  constructor(options) {
    super(options);
    this.meterSmoothingFactor = 0.9;
    this.meterMinimum = 0.00001;
    this._volume = 0;
  }

  process (inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    const { threshold } = parameters;
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
    const letPass = this._volume >= threshold[0];
    for (let channel = 0; channel < input.length; ++channel) {
      for (let i = 0; i < input[channel].length; ++i) {
        output[channel][i] = letPass ? input[channel][i] : 0;
      }
    }
    return true;
  }
}
registerProcessor('Gate', Gate);
