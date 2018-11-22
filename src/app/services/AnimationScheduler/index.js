export default class AnimationScheduler {
  constructor() {
    this.schedules = [];
  }

  submit(schedule) {
    this.schedules.push(schedule);
  }

  getLatestSchedule(now) {
    if (!this.schedules.length) {
      return false;
    }
    if (this.schedules[0] > now) {
      return false;
    }
    if (this.schedules.length === 1) {
      return this.schedules.pop();
    }
    let i = 1;
    while (i < this.schedules.length) {
      if (this.schedules[i] > now) {
        const latestSchedule = this.schedules[i - 1];
        this.schedules.splice(0, i);
        return latestSchedule;
      }
      i++;
    }
    return false;
  }
}
