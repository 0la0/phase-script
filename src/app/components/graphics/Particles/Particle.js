export default class Particle {

  constructor(position, velocity, timeToLive) {
    this.position = position;
    this.velocity = velocity;
    this.timeToLive = timeToLive;
    this.totalTime = 0;
  }

  update(elapsedTime) {
    this.totalTime += elapsedTime * 1000;
    this.position.add(this.velocity.clone().multiplyScalar(elapsedTime));
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
