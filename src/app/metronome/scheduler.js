
export default class Scheduler {

  constructor(audioContext) {
    this.audioContext = audioContext;
    this.registry = new Set();
    this.isRunning = false;
    this.resetCounterVariables();
  }

  masterScheduler(time) {
    this.nextScheduledTime = time.midi;
    this.registry.forEach(schedulable => schedulable.processTick(this.tickCounter, time));
    this.tickToRender = this.tickCounter++;
  }

  register(schedulable) {
    this.registry.add(schedulable);
  }

  deregister(schedulable) {
    this.registry.delete(schedulable);
  }

  start() {
    this.isRunning = true;
    this.registry.forEach(schedulable => schedulable.start());
    this.render();
  }

  stop() {
    this.isRunning = false;
  }

  render() {
    //TODO: implement render ahead buffer time (next >= now - renderBuffer)
    if (this.nextScheduledTime.midi >= performance.now() && this.tickToRender !== this.lastTickRendered) {
      this.registry.forEach(schedulable => schedulable.render(this.tickCounter, this.lastTickRendered));
      this.lastTickRendered = this.tickToRender;
    }
    if(this.isRunning) {
      requestAnimationFrame(this.render.bind(this));
    }
    else {
      this.resetCounterVariables();
      this.registry.forEach(schedulable => schedulable.stop());
    }
  }

  resetCounterVariables() {
    this.tickCounter = 0;
    this.tickToRender = 0;
    this.lastTickRendered = 0;
    this.nextScheduledTime = Number.MAX_VALUE;
  }

}
