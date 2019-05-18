import TimeSchedule from 'services/metronome/TimeSchedule';
import audioGraph from 'services/audio/Graph';
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
    this.nextTickSchedule = new TimeSchedule();
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
    this.noteScheduler.processTick(this.nextTickSchedule.clone().addMidi(MIDI_TIME_DELAY));
    this.nextTickSchedule.add(tickLength);
  }

  start() {
    if (this.isRunning) {
      // eslint-disable-next-line no-console
      console.log('Cannot start a running metronome');
      return;
    }
    audioGraph.startContext().then(() => {
      this.nextTickSchedule.midi = performance.now() + 1; // TOOD: tune this param
      this.nextTickSchedule.audio = this.audioContext.currentTime;
      this.noteScheduler.start();
      this.timerWorker.postMessage('start');
      this.isRunning = true;
    });
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
