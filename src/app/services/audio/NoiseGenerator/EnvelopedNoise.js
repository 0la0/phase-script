import audioGraph from 'services/audio/graph';
import { AsrEnvelope } from 'services/audio/Envelope';

export default function envelopedNoiseGenerator(midiNote, startTime, asr, type, gain, outputs, modulator, onComplete) {
  const endTime = startTime + asr.attack + asr.sustain + asr.release;
  const noiseGenerator = new AudioWorkletNode(audioGraph.getAudioContext(), 'NoiseGenerator');
  // TODO: apply logic from ASR envelope to amplitude parameter of NoiseGen
  // let envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release).build(startTime, gain);
  // noiseGenerator.connect(envelope);
  outputs.forEach(output => envelope.connect(output));
  noiseGenerator.onended = () => envelope.disconnect();
  noiseGenerator.start(startTime);
  noiseGenerator.stop(endTime);
}
