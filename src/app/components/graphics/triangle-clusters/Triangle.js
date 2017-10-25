import {getRandomVector} from 'components/graphics/util';
import {
  MeshBasicMaterial,
  DoubleSide,
  Geometry,
  Vector3,
  Face3,
  Mesh,
  Euler,
  BoxHelper,
  Group,
  LineBasicMaterial,
  Line
} from 'three';

const TWO_PI = 2 * Math.PI;
const DISTANCE_THRESH = 0.005;

function buildTriangle(size) {
  const buffer = size / 2;
  const color = Math.random() * 0xFFFFFF;
  const triangleMaterial = new MeshBasicMaterial({color, side: DoubleSide});
  const triangleGeometry = new Geometry();
  const lineGeometry1 = new Geometry();
  const lineGeometry2 = new Geometry();
  const lineGeometry3 = new Geometry();
  const lineMaterial = new LineBasicMaterial({color});
  const v1 = new Vector3(-buffer, -buffer, 0);
  const v2 = new Vector3(-buffer,  buffer, 0);
  const v3 = new Vector3( buffer,  buffer, 0);
  triangleGeometry.vertices.push(v1);
  triangleGeometry.vertices.push(v2);
  triangleGeometry.vertices.push(v3);
  triangleGeometry.faces.push(new Face3(0, 1, 2));
  triangleMaterial.transparent = true;
  triangleMaterial.opacity = 0.5;

  lineGeometry1.vertices.push(v1);
  lineGeometry1.vertices.push(v2);
  lineGeometry2.vertices.push(v2);
  lineGeometry2.vertices.push(v3);
  lineGeometry3.vertices.push(v3);
  lineGeometry3.vertices.push(v1);

  const triangleMesh = new Mesh(triangleGeometry, triangleMaterial);
  const line1 = new Line(lineGeometry1, lineMaterial);
  const line2 = new Line(lineGeometry2, lineMaterial);
  const line3 = new Line(lineGeometry3, lineMaterial);
  const group = new Group();
  group.add(triangleMesh, line1, line2, line3);
  return group;
  // return new Mesh(triangleGeometry, triangleMaterial);
}

export default class Triangle {

  constructor(size, center) {
    this.center = center.clone();
    // this.mesh = buildTriangle(size, center);
    this.triangle = buildTriangle(size, center);
    this.positionGoal = getRandomVector(30, true);
    this.positionVelocity = getRandomVector(0, false);
    this.scaleGoal = getRandomVector(10, false);
    this.scaleVelocity = getRandomVector(0, false);
    this.rotateGoal = getRandomVector(Math.PI, false);
    this.rotateVelocity = getRandomVector(0, false);
    this.reset();
  }

  reset() {
    this.shouldRender = true;
    this.positionGoal = this.center.clone().add(getRandomVector(10, true));
    this.scaleGoal = getRandomVector(4, false);
    this.rotateGoal = getRandomVector(Math.PI, false);
  }

  getMesh() {
    return this.triangle;
  }

  update(elapsedTime) {
    if (!this.shouldRender) {
      return;
    }

    const positionDistance = this.positionGoal.clone()
      .sub(this.triangle.position.clone())
      .multiplyScalar(50 * Math.random() * elapsedTime);
    this.positionVelocity.add(positionDistance);
    const positionVelocity = this.positionVelocity.clone()
      .multiplyScalar(0.5)
      .add(positionDistance.multiplyScalar(0.5));
    this.triangle.position.add(positionVelocity);

    const scaleDistance = this.scaleGoal.clone()
      .sub(this.triangle.scale.clone())
      .multiplyScalar(50 * Math.random() * elapsedTime);
    this.scaleVelocity.add(scaleDistance);
    const scaleVelocity = this.scaleVelocity.clone()
      .multiplyScalar(0.5)
      .add(scaleDistance.multiplyScalar(0.5));
    this.triangle.scale.add(scaleVelocity);

    const rotateDistance = this.rotateGoal.clone()
      .sub(this.triangle.rotation.clone().toVector3())
      .multiplyScalar(50 * Math.random() * elapsedTime);
    this.rotateVelocity.add(rotateDistance);
    const rotateVelocity = this.rotateVelocity.clone()
      .multiplyScalar(0.5)
      .add(rotateDistance.multiplyScalar(0.5));
    const rotation = this.triangle.rotation.clone().toVector3().add(rotateVelocity);
    this.triangle.rotation.setFromVector3(rotation);

    const meanDistance = positionDistance
      .add(scaleDistance)
      .add(rotateDistance)
      .multiplyScalar(0.33)
      .length();

    if (meanDistance <= DISTANCE_THRESH) {
      this.shouldRender = false;
    }
  }

}
