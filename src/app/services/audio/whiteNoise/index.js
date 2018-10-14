import audioGraph from 'services/audio/graph';
import { AsrEnvelope } from 'services/audio/util/Envelopes';
import scaleHelper from 'services/scale/scaleHelper';

const BUFFER = buildNoiseSample(audioGraph.getAudioContext(), 2);

function buildNoiseSample(audioContext, bufferLengthSeconds) {
  const frameCount = audioContext.sampleRate * bufferLengthSeconds;
  const buffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  for (let i = 0; i < frameCount; i++) {
   leftChannel[i] = 2 * Math.random() - 1;
   rightChannel[i] = 2 * Math.random() - 1;
  }
  return buffer;
}

export function playNoiseBuffer(startTime, asr, gain, outputs) {
  const endTime = startTime + asr.attack + asr.sustain + asr.release;
  const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
    .build(startTime, gain);
  const bufferSource = audioGraph.getAudioContext().createBufferSource();
  bufferSource.buffer = BUFFER;
  outputs.forEach(output => envelope.connect(output));
  bufferSource.connect(envelope);
  bufferSource.loop = true;
  bufferSource.start(startTime);
  bufferSource.stop(endTime);
}
