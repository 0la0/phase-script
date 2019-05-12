import audioGraph from 'services/audio/graph';
import {mtof} from 'services/midi/util';
import { AsrEnvelope } from 'services/audio/Envelope';
import { getOscillatorType, } from 'services/audio/synth/Oscillators';
import { isPrimitiveWaveform, getPeriodicWave, } from './wavetableProvider';

export default function envelopedOscilator(midiNote, startTime, asr, type, gain, outputs, modulator) {
  const frequency = mtof(midiNote);
  startTime = startTime || audioGraph.getCurrentTime();
  const endTime = startTime + asr.attack + asr.sustain + asr.release;
  const osc = audioGraph.getAudioContext().createOscillator();
  const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release).build(startTime, gain);

  if (isPrimitiveWaveform(type)) {
    osc.type = getOscillatorType(type);
  } else {
    const periodicWave = getPeriodicWave(type);
    if (!periodicWave) {
      osc.type = 'sine';
    } else {
      const wave = audioGraph.getAudioContext().createPeriodicWave(periodicWave.real, periodicWave.imaginary, { disableNormalization: true });
      osc.setPeriodicWave(wave);
    }
  }

  osc.frequency.value = frequency;
  osc.connect(envelope);
  outputs.forEach(output => envelope.connect(output));

  if (modulator) {
    modulator.forEach ?
      modulator.forEach(connectTo => connectTo(osc.frequency)) :
      modulator.connect(osc.frequency);
  }

  osc.onended = () => envelope.disconnect();
  osc.start(startTime);
  osc.stop(endTime);
}
