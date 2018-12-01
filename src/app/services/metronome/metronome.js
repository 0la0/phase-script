import { AUDIO_TICK_MULTIPLIER } from 'services/midi/util';
import TimeSchedule from 'services/metronome/TimeSchedule';
import workerString from './metronome.worker';

const workerUrl = URL.createObjectURL(new Blob([workerString]));
const TICK = 'tick';
const LOOKAHEAD_TIME = 25;
const SCHEDULE_AHEAD_TIME = 100;
const MIDI_TIME_DELAY = 30; // for syncing with audio scheduling

export default class Metronome {
  constructor(audioContext, noteScheduler) {
    this.audioContext = audioContext;
    this.noteScheduler = noteScheduler;
    this.nextTickSchedule = new TimeSchedule(0, 0);
    this.lookahead = LOOKAHEAD_TIME;
    this.tempo = 120.0;
    this.isRunning = false;
    this.timerWorker = new Worker(workerUrl);
    this.timerWorker.addEventListener('message', this.handleTimerMessage.bind(this));
    this.timerWorker.postMessage({ interval: this.lookahead });
  }

  scheduler() {
    if (this.nextTickSchedule.midi > performance.now() + SCHEDULE_AHEAD_TIME) { return; }
    const tickLength = this.getTickLength();
    this.noteScheduler.processTick(new TimeSchedule(
      this.nextTickSchedule.audio,
      this.nextTickSchedule.midi + MIDI_TIME_DELAY
    ));
    this.nextTickSchedule.midi += tickLength * AUDIO_TICK_MULTIPLIER;
    this.nextTickSchedule.audio += tickLength;
  }

  start() {
    if (this.isRunning) {
      console.warn('Cannot start a running metronome');
      return;
    }
    this.nextTickSchedule.midi = performance.now() + 1; // TOOD: tune this param
    this.nextTickSchedule.audio = this.audioContext.currentTime;
    this.noteScheduler.start();
    this.timerWorker.postMessage('start');
    this.isRunning = true;
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

  getTickLength() {
    return 0.125 * 60.0 / this.tempo;
  }

  handleTimerMessage(event) {
    if (event.data === TICK) {
      this.scheduler();
    }
    // else {
    //   console.log('timerWorker message:', event.data);
    // }
  }
}
