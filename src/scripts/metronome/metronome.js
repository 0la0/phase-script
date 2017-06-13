const workerString = require('./metronome.worker');
const workerUrl = URL.createObjectURL(new Blob([workerString]));

const TICK = 'tick';
const LOOKAHEAD_TIME = 25;
const SCHEDULE_AHEAD_TIME = 100;
const BASE_TIME = performance.now();

export default class Metronome {

  constructor(audioContext, noteScheduler) {
    this.audioContext = audioContext;
    this.noteScheduler = noteScheduler;

    this.nextTickSchedule = {
      midi: 0.0,
      audio: 0.0
    };

    this.lookahead = LOOKAHEAD_TIME;
    this.tempo = 120.0;
    this.isRunning = false;
    this.timerWorker = new Worker(workerUrl);

    this.timerWorker.onmessage = event => {
      if (event.data === TICK) {
        this.scheduler();
      }
      else {
        //console.log('timerWorker message:', event.data);
      }
    };
    this.timerWorker.postMessage({'interval': this.lookahead});
  }

  scheduler() {
    if (this.nextTickSchedule.midi < performance.now() + SCHEDULE_AHEAD_TIME) {
      const nextSchedule = 0.25 * 60.0 / this.tempo;
      this.noteScheduler.masterScheduler(this.nextTickSchedule);

      this.nextTickSchedule.midi += nextSchedule * 1000;
      this.nextTickSchedule.audio += nextSchedule;
    }
  }

  start() {
    if (!this.isRunning) {
      this.nextTickSchedule.midi = performance.now() + 1;
      this.nextTickSchedule.audio = this.audioContext.currentTime;
      this.noteScheduler.start();
      this.timerWorker.postMessage('start');
      this.isRunning = true;
    }
    else {
      console.warn('Cannot start a running metronome');
    }
  }

  stop() {
    this.noteScheduler.stop();
    this.timerWorker.postMessage('stop');
    this.isRunning = false;
  }

  setTempo(tempo) {
    this.tempo = tempo;
  }

  getTempo() {
    return this.tempo;
  }

}
