import audioGraph from 'services/audio/Graph';
import OSCILLATORS from 'services/audio/synth/Oscillators';

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
  osc.type = OSCILLATORS[waveType];
  osc.frequency.setValueAtTime(frequency, 0); // TODO: experiment with a constant frequency
  osc.start(startTime);
  osc.stop(endTime);
}
