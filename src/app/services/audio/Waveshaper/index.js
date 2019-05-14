/**
 *  Waveshaper curves, see:
 *  https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
 *  http://music.columbia.edu/cmc/MusicAndComputers/chapter4/04_06.php
 *  http://msp.ucsd.edu/techniques/v0.11/book-html/node78.html
 */
import audioGraph from 'services/audio/graph';
import WetLevel from 'services/audio/WetLevel';

const CARRIER_FUNCTIONS = {
  square: x => Math.pow(x, 2),
  cubed: x => Math.pow(x, 3),
  chebyshev2: x => 2 * Math.pow(x, 2) - 1,
  chebyshev3: x => 4 * Math.pow(x, 3) - 3 * x,
  chebyshev4: x => 8 * Math.pow(x, 4) - 8 * Math.pow(x, 2) + 1,
  sigmoid: x => 2 / (1 + Math.exp(-4 * x)) - 1,
  sigmoid2: x => 1.5 / (1 + Math.exp(-10 * x)) - 0.75,
  sigmoidLike: (x, multiplier) =>  ( 3 + multiplier ) * x * 20 * (Math.PI / 180) / ( Math.PI + multiplier * Math.abs(x) ),
  hardClip: x =>  (1 + 0.4 * x) / (1 + Math.abs(x))
};

const CARRIER_NAMES = {
  squ: 'square',
  cube: 'cubed',
  cheb: 'chebyshev2',
  sig: 'sigmoidLike',
  clip: 'hardClip',
};

function createCurve(carrierFunction, sampleRate, multiplier) {
  let curve = new Float32Array(sampleRate);
  for (let i = 0; i < sampleRate; i++) {
    //adjust x such that the curve is centered in its domain
    let x = i * 2 / sampleRate - 1;
    //sigmoid with fast dropoff, range is (-1, 1)
    curve[i] = carrierFunction(x, multiplier, sampleRate);
  }
  return curve;
}

export default class Waveshaper {
  constructor (type = 'sig') {
    const audioContext = audioGraph.getAudioContext();
    this.sampleRate = audioContext.sampleRate;
    this.input = audioContext.createGain();
    this.waveshaperNode = audioContext.createWaveShaper();
    this.wetLevel = new WetLevel(audioContext, this.input, this.waveshaperNode);
    this.input.connect(this.waveshaperNode);
    this.setCarrierFunction(CARRIER_NAMES[type]);
  }

  connect(node) {
    this.wetLevel.connect(node);
  }

  disconnect(node) {
    this.wetLevel.disconnect(node);
  }

  getInput() {
    return this.input;
  }

  getWetParam() {
    return this.wetLevel;
  }

  setCarrierFunction(functionKey) {
    if (!CARRIER_FUNCTIONS[functionKey]) {
      throw new Error(`Waveshkaper.setCarrierFunction invalid function ${functionKey}`);
    }
    this.waveshaperNode.curve = createCurve(CARRIER_FUNCTIONS[functionKey], this.sampleRate, 50);
  }
}
