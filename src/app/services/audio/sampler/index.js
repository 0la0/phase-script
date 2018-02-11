import audioGraph from 'services/audio/graph';
import { audioEventBus } from 'services/EventBus';
import { AsrEnvelope } from 'services/audio/util/Envelopes';
import { getAudioBuffer } from 'services/audio/sampleBank';

// flow: sampler -> adsr -> gain -> abstractOutput

function playSample(audioContext, audioBuffer, scheduledTime, startOffset, asr) {
  const sampler = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  const output = audioGraph.getOutput();

  if (!scheduledTime) {
    scheduledTime = audioGraph.getAudioContext().getOutputTimestamp().contextTime;
  }

  const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
    .build(scheduledTime);
  gain.connect(output);
  envelope.connect(gain);
  sampler.connect(envelope);
  sampler.buffer = audioBuffer;
  sampler.start(scheduledTime, startOffset);
}

function play(sampleKey, scheduledTime, startOffset, asr) {
  const audioBuffer = getAudioBuffer(sampleKey);
  playSample(audioGraph.getAudioContext(), audioBuffer, scheduledTime, startOffset, asr);
}

// TODO: remove ... regristration should happen in instrument components
function registerEvents() {
  console.log('----subscribe???')
  audioEventBus.subscribe({
    address: 'SAMPLER',
    onNext: message => {
      play(message.note, message.time);
    }
  });
}

export { play };
