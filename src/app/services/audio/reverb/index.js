import audioGraph from 'services/audio/graph';
import buildConvolutionBuffer from 'services/audio/reverb/convolutionBuilder';

export default class Reverb  {
  constructor () {
    const audioContext = audioGraph.getAudioContext();
    this.convolver = audioContext.createConvolver();
    this.input = audioContext.createGain();
    this.dryGain = audioContext.createGain();
    this.wetGain = audioContext.createGain();
    this.input.connect(this.dryGain);
    this.input.connect(this.convolver);
    this.convolver.connect(this.wetGain);

    this.attack = 0.1;
    this.decay = 0.5;
    this.generateBuffer();
    this.setWetLevel(0.5, 0);
  }

  connect(node) {
    this.dryGain.connect(node);
    this.wetGain.connect(node);
  }

  disconnect(node) {
    this.dryGain.disconnect(node);
    this.wetGain.disconnect(node);
  }

  getInput() {
    return this.input;
  }

  setGain(gain) {
    this.gain.gain.setValueAtTime(gain, 0);
  }

  setAttack(attack) {
    this.attack = attack;
    this.generateBuffer();
  }

  setDecay(decay) {
    this.decay = decay;
    this.generateBuffer();
  }

  setWetLevel(normalValue, scheduledTime) {
    this.wetGain.gain.linearRampToValueAtTime(normalValue, scheduledTime);
    this.dryGain.gain.linearRampToValueAtTime(1 - normalValue, scheduledTime);
  }

  // domain: [-24, 0]
  // setWetLevel(normalValue) {
  //   const wetLevel = -24 * (1 - normalValue);
  //   console.log("input", wetLevel);
  //   const wetGain = Math.pow(10, wetLevel / 20);
  //   const dryGain = Math.sqrt(1 - wetGain * wetGain);
  //   console.log('dry/wet', dryGain, wetGain)
  //   this.wetGain.gain.value = wetGain;
  //   this.dryGain.gain.value = dryGain;
  //
  //   this.generateBuffer();
  // }

  // TODO: MOVE TO WEB WORKER?
  generateBuffer() {
    setTimeout(() => {
      const buffer = buildConvolutionBuffer(this.attack, this.decay);
      this.convolver.buffer = buffer;
    });
  }
}
