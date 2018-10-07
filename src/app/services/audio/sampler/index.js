import audioGraph from 'services/audio/graph';
import { AsrEnvelope } from 'services/audio/util/Envelopes';
import { getAudioBuffer } from 'services/audio/sampleBank';

// flow: sampler -> adsr -> gain -> abstractOutput

const semitoneRatio = Math.pow(2, 1 / 12);

// function playSample(audioContext, audioBuffer, scheduledTime, startOffset, asr) {
//   const sampler = audioContext.createBufferSource();
//   const gain = audioContext.createGain();
//   const output = audioGraph.getOutput();
//
//   if (!scheduledTime) {
//     scheduledTime = audioGraph.getAudioContext().getOutputTimestamp ?
//       audioGraph.getAudioContext().getOutputTimestamp().contextTime : 0;
//   }
//
//   const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
//     .build(scheduledTime);
//   gain.connect(output);
//   envelope.connect(gain);
//   sampler.connect(envelope);
//   sampler.buffer = audioBuffer;
//   sampler.start(scheduledTime, startOffset);
// }

function playTemp(sampleKey, scheduledTime, startOffset, note, asr, outputs) {
  const audioBuffer = getAudioBuffer(sampleKey);
  const sampler = audioGraph.getAudioContext().createBufferSource();
  if (!scheduledTime) {
    scheduledTime = audioGraph.getAudioContext().getOutputTimestamp ?
      audioGraph.getAudioContext().getOutputTimestamp().contextTime : 0;
  }
  const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
    .build(scheduledTime);
  sampler.connect(envelope);
  outputs.forEach(output => envelope.connect(output));
  sampler.buffer = audioBuffer;
  // pitch += Math.round(this.baseNote);
  sampler.playbackRate.value = Math.pow(semitoneRatio, note - 60);

  // TODO: add playback length as last arg
  sampler.start(scheduledTime, startOffset);
}

// function play(sampleKey, scheduledTime, startOffset, asr) {
//   const audioBuffer = getAudioBuffer(sampleKey);
//   playSample(audioGraph.getAudioContext(), audioBuffer, scheduledTime, startOffset, asr);
// }

export {
  // play,
  playTemp
};
