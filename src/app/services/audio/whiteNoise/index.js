import audioGraph from 'services/audio/graph';
import {ArEnvelope} from 'services/audio/util/Envelopes';
import {mtof} from 'services/midi/util';
import scaleHelper from 'services/scale/scaleHelper';

// flow: noise -> adsr -> filters -> gain -> abstractOutput

function buildNoiseSample(audioContext) {
  const frameCount = audioContext.sampleRate * 2.0; //two second buffer
  const buffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);
  for (let i = 0; i < frameCount; i++) {
   leftChannel[i] = 2 * Math.random() - 1;
   rightChannel[i] = 2 * Math.random() - 1;
  }
  return buffer;
}

export default class WhiteNoise {

  constructor() {
    this.asr = {
      attack: 0.01,
      sustain: 0.5,
      release: 0.1
    };
    this.noiseSample = buildNoiseSample(audioGraph.getAudioContext());
    this.outputGain = audioGraph.getAudioContext().createGain();
    this.outputGain.connect(audioGraph.getOutput());
  }

  playNote(midiNote, noiseNodes, onTime, offTime) {
    const noiseNode = noiseNodes && noiseNodes[0];
    if (!noiseNode) { return; }
    const frequencies = scaleHelper.progressiveScale
      .map(scaleNote => midiNote + scaleNote)
      .map(note => mtof(note));
    // const frequency = mtof(midiNote);
    this.playFrequencies(frequencies, noiseNode, onTime, offTime);
  }

  playFrequencies(frequencies, noiseNode, onTime, offTime) {
    const filters = frequencies.map(frequency => {
      const filter = audioGraph.getAudioContext().createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 100;
      filter.frequency.value = frequency;
      filter.connect(this.outputGain);

      const envelope = new ArEnvelope(this.asr.attack, this.asr.release).build(filter, onTime, offTime);
      this.outputGain.gain.setValueAtTime(noiseNode.gain, onTime);
      this.bufferSource = audioGraph.getAudioContext().createBufferSource();
      this.bufferSource.buffer = this.noiseSample;
      this.bufferSource.connect(envelope);
      this.bufferSource.loop = true;
      this.bufferSource.start(onTime);
      this.bufferSource.stop(offTime + this.asr.release);
    });
  }

  setAttack(attack) {
    this.asr.attack = attack;
  }

  getAttack() {
    return this.asr.attack;
  }

  setRelease(release) {
    this.asr.release = release;
  }

  getRelease() {
    return this.asr.release;
  }

}
