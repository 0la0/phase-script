import audioGraph from 'services/audio/graph';

const NUM_CHANNELS = 2;

function getRandomSample() {
  return 2 * Math.random() - 1;
}

export default function buildConvolutionBuffer(attackTime, decayTime) {
  const audioContext = audioGraph.getAudioContext();
  const sampleRate = audioContext.sampleRate;
  // decayTime is the -60dB fade time. We let it go 50% longer to get to -90dB.
  const totalTime = decayTime * 1.5;
  const decaySampleFrames = Math.round(decayTime * sampleRate);
  const numSampleFrames = Math.round(totalTime * sampleRate);
  const fadeInSampleFrames = Math.round(attackTime * sampleRate);
  // 60dB is a factor of 1 million in power, or 1000 in amplitude.
  const decayBase = Math.pow(1 / 1000, 1 / decaySampleFrames);
  const reverbIR = audioContext.createBuffer(NUM_CHANNELS, numSampleFrames, sampleRate);
  for (let i = 0; i < NUM_CHANNELS; i++) {
    const chan = reverbIR.getChannelData(i);
    for (let j = 0; j < numSampleFrames; j++) {
      chan[j] = getRandomSample() * Math.pow(decayBase, j);
    }
    for (let k = 0; k < fadeInSampleFrames; k++) {
      chan[k] *= (k / fadeInSampleFrames);
    }
  }
  return reverbIR;
}
