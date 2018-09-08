import audioGraph from 'services/audio/graph';

function getRandomSample() {
  return 2 * Math.random() - 1;
}

export default function buildConvolutionBuffer(attackTime, decayTime) {
  const audioContext = audioGraph.getAudioContext();
  const sampleRate = audioContext.sampleRate;
  const numChannels = 2; // TODO: move out of function
  // var numChannels = params.numChannels || 2;
  // decayTime is the -60dB fade time. We let it go 50% longer to get to -90dB.
  const totalTime = decayTime * 1.5;
  const decaySampleFrames = Math.round(decayTime * sampleRate);
  const numSampleFrames = Math.round(totalTime * sampleRate);
  const fadeInSampleFrames = Math.round(attackTime * sampleRate);
  // 60dB is a factor of 1 million in power, or 1000 in amplitude.
  const decayBase = Math.pow(1 / 1000, 1 / decaySampleFrames);
  const reverbIR = audioContext.createBuffer(numChannels, numSampleFrames, sampleRate);
  for (var i = 0; i < numChannels; i++) {
    const chan = reverbIR.getChannelData(i);
    for (var j = 0; j < numSampleFrames; j++) {
      chan[j] = getRandomSample() * Math.pow(decayBase, j);
    }
    for (var j = 0; j < fadeInSampleFrames; j++) {
      chan[j] *= (j / fadeInSampleFrames);
    }
  }
  return reverbIR;
}
