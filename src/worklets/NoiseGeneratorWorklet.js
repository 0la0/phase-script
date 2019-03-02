class NoiseGenerator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [];
  }

  process(inputs, outputs) {
    for (let channel = 0; channel < inputs[0].length; ++channel) {
      for (let i = 0; i < inputs[0][channel].length; ++i) {
        outputs[0][channel][i] = 2 * (Math.random() - 0.5);
      }
    }
    return true;
  }
}
registerProcessor('NoiseGenerator', NoiseGenerator);
