
export default class Sampler {

  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  play(audioBuffer, schedule, outputNode) {
    const sampler = audioContext.createBufferSource();
    sampler.buffer = audioBuffer;
    sampler.connect(outputNode);
    sampler.start(schedule);
  }

}
