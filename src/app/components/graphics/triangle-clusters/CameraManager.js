import {getRandomVector} from 'components/graphics/util';
import {getPosNeg} from 'services/Math';
import {Vector3} from 'three';

const DISTANCE_FACTOR = 2;
const DISTANCE_THRESH = 0.1;
const CENTER = new Vector3(0, 0, 0);

export default class CameraManager {

  constructor(camera) {
    this.camera = camera;
    this.camera.position.set(0, 0, 100);
    this.reset();
    this.clickCnt = 0;
  }

  reset() {
    if (this.clickCnt++ % 6 !== 0) { return; }
    if (Math.random() < 0.5) { return; }
    const rand = getRandomVector(70, true);
    this.goal = new Vector3(
      getPosNeg() * 100 + rand.x,
      getPosNeg() * 100 + rand.y,
      getPosNeg() * 100 + rand.z
    );
    this.shouldUpdate = true;
  }

  update(elapsedTime) {
    if (!this.shouldUpdate) { return; }
    const difference = this.goal.clone()
      .sub(this.camera.position);
    const distanceToMove = difference.clone()
      .sub(this.camera.position)
      .multiplyScalar(DISTANCE_FACTOR * elapsedTime);
    this.camera.position.add(distanceToMove);
    this.camera.lookAt(CENTER);
    if (distanceToMove.length() <= DISTANCE_THRESH) {
      this.shouldUpdate = false;
    }
  }

  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }

}
