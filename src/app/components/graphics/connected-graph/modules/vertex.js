import {
  Vector3,
  SphereGeometry,
  LineBasicMaterial,
  Mesh
} from 'three';
import {getPosNeg} from 'services/Math';

export default class Vertex {

  constructor() {
    const geometry = new SphereGeometry(0.1, 6, 6);
    const material = new LineBasicMaterial({color: 0xCCCCCC});
    this.mesh = new Mesh(geometry, material);
    this.reset();
  }

  reset() {
    const centroid = this.goal = new Vector3(
      150 * getPosNeg() * Math.random(),
      150 * getPosNeg() * Math.random(),
      -300 * Math.random()
    );
    this.goal = new Vector3(
      centroid.x * Math.random(),
      centroid.y * Math.random(),
      centroid.z * Math.random(),
    );
    this.velocity = new Vector3(
      5000 * getPosNeg() * Math.random(),
      5000 * getPosNeg() * Math.random(),
      5000 * getPosNeg() * Math.random()
    );
  }

  getPosition() {
    return this.mesh.position.clone();
  }

  update(elapsedTime) {
    this.mesh.position.add(
      this.goal.clone()
        .sub(this.getPosition())
        .multiplyScalar(30 * Math.random() * elapsedTime)
    );
  }

  getDistance() {
    return this.goal.clone().sub(this.getPosition()).length();
  }

}
