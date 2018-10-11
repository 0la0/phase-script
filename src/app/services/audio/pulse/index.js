import audioGraph from 'services/audio/graph';
import { OSCILATORS } from 'services/audio/synth/Osc';
import {mtof} from 'services/midi/util';

export default function triggerPulse(frequency, waveType, startTime, duration, resonance, outputs) {
  const audioContext = audioGraph.getAudioContext();
  const endTime = startTime + duration;
  const osc = audioContext.createOscillator();
  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = frequency;
  filter.Q.value = resonance;
  osc.connect(filter);
  outputs.forEach(output => filter.connect(output));
  osc.type = OSCILATORS[waveType];
  osc.frequency.setValueAtTime(frequency, 0); // TODO: experiment with a constant frequency
  osc.start(startTime);
  osc.stop(endTime);
}
