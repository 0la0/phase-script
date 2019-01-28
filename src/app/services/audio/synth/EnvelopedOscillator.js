import audioGraph from 'services/audio/graph';
import {mtof} from 'services/midi/util';
import { AsrEnvelope } from 'services/audio/Envelope';
import { playNoiseBuffer } from 'services/audio/whiteNoise';
import OSCILATORS from 'services/audio/synth/Oscillators';

export default function envelopedOscilator(midiNote, startTime, asr, type, gain, outputs, modulator, onComplete) {
  const _type = OSCILATORS[type] || OSCILATORS.SINE;
  if (_type === OSCILATORS.NOISE) {
    playNoiseBuffer(startTime, asr, gain, outputs);
    return;
  }
  const frequency = mtof(midiNote);
  const endTime = startTime + asr.attack + asr.sustain + asr.release;
  const osc = audioGraph.getAudioContext().createOscillator();
  let envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
    .build(startTime, gain);
  osc.connect(envelope);
  outputs.forEach(output => envelope.connect(output));
  osc.type = _type;
  // osc.frequency.setValueAtTime(frequency, 0);
  osc.frequency.value = frequency;
  if (modulator) {
    modulator.connect(osc.frequency);
  }
  osc.onended = () => envelope.disconnect();
  osc.start(startTime);
  osc.stop(endTime);
}
