export default class Particle {

  constructor(position, velocity, timeToLive) {
    this.position = position;
    this.velocity = velocity.multiplyScalar(0.1);
    this.timeToLive = timeToLive;
    this.totalTime = 0;
  }

  update(elapsedTime) {
    this.totalTime += elapsedTime * 0.5;
    this.position.add(this.velocity.clone().multiplyScalar(this.totalTime * this.totalTime));
  }

  getPosition() {
    return this.position;
  }

  reset(position, timeToLive) {
    this.position.copy(position);
    this.timeToLive = timeToLive;
    this.totalTime = 0;
  }

  isExpired() {
    return this.totalTime > this.timeToLive;
  }

}
