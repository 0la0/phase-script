import audioGraph from 'services/audio/graph';
import {mtof} from 'services/midi/util';
import { AsrEnvelope } from 'services/audio/util/Envelopes';
import { playNoiseBuffer } from 'services/audio/whiteNoise';

const OSCILATORS = {
  SINE: 'sine',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth',
  TRIANGLE: 'triangle',
  NOISE: 'noise',
};

export default class Osc {
  constructor(type) {
    this.setType(type);
  }

  setType(type) {
    this.type = OSCILATORS[type] || OSCILATORS.SINE;
  }

  playNote(midiNote, startTime, asr, gain, outputs) {
    if (this.type === OSCILATORS.NOISE) {
      playNoiseBuffer(startTime, asr, gain, outputs);
    } else {
      this._playNote(midiNote, startTime, asr, gain, outputs);
    }
  }

  _playNote(midiNote, startTime, asr, gain, outputs) {
    const frequency = mtof(midiNote);
    const endTime = startTime + asr.attack + asr.sustain + asr.release;
    const osc = audioGraph.getAudioContext().createOscillator();
    const envelope = new AsrEnvelope(asr.attack, asr.sustain, asr.release)
      .build(startTime, gain);
    osc.connect(envelope);
    outputs.forEach(output => envelope.connect(output));
    osc.type = this.type;
    osc.frequency.setValueAtTime(frequency, 0);
    osc.start(startTime);
    osc.stop(endTime);
  }
}

class ContinuousOsc {
  constructor(type) {
    this.setType(type);
    this.outputs = new Set([]);
    this.isOn = false;
  }

  setType(type) {
    this.type = OSCILATORS[type] || OSCILATORS.SINE;
  }

  connect(node) {
    console.log('LFO connect to:', node);
    this.outputs.add(node);
    if (this.osc) {
      this.osc.connect(node);
    }
  }

  disconnect(node) {
    this.outputs.delete(node);
    if (this.osc) {
      this.osc.disconnect(node);
    }
  }

  start(frequency, startTime) {
    this.osc = audioGraph.getAudioContext().createOscillator();
    this.osc.type = this.type;
    this.outputs.forEach(output => this.osc.connect(output));
    this.osc.start(startTime);
  }

  stop(offTime) {
    this.osc.stop(offTime);
    this.osc = undefined;
  }

  setFrequency(frequency, time) {
    if (!this.osc) { return; }
    const targetTime = (time === undefined) ? 0 : time;
    this.osc.frequency.setValueAtTime(frequency, targetTime);
  }
}

export { OSCILATORS, ContinuousOsc };
