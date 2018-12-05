import audioGraph from 'services/audio/graph';
import { AsrEnvelope } from 'services/audio/Envelope';
import sampleBank from 'services/audio/sampleBank';

// flow: sampler -> adsr -> gain -> abstractOutput
const semitoneRatio = Math.pow(2, 1 / 12);

function playSample(sampleKey, scheduledTime, startOffset, note, asr, outputs) {
  const audioBuffer = sampleBank.getAudioBuffer(sampleKey);
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

export { playSample };
