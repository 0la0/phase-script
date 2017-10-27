import {getRandomVector} from 'components/graphics/util';
import {getPosNeg} from 'components/_util/math';
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
  Line,
  Color
} from 'three';

const TWO_PI = 2 * Math.PI;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getColorFromBase(baseColor, spread) {
  const r = baseColor.x + getPosNeg() * spread * Math.random();
  const g = baseColor.y + getPosNeg() * spread * Math.random();
  const b = baseColor.z + getPosNeg() * spread * Math.random();
  return new Color(r, g, b);
}

function buildTriangle(size, center, baseColor) {
  const buffer = size / 2;
  const color = getColorFromBase(baseColor, 0.2);
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
  // group.add(triangleMesh, line1, line2, line3);
  group.add(triangleMesh);
  return group;
}

const defaultOptions = {
  shouldSet: false,
  size: 10,
  positionSpread: 10,
  scaleSpread: 4,
};

function fillOptions(options) {
  return {
    shouldSet: options.shouldSet || defaultOptions.shouldSet,
    size: options.size || defaultOptions.size,
    positionSpread: options.positionSpread || defaultOptions.positionSpread,
    scaleSpread: options.scaleSpread || defaultOptions.scaleSpread,
  };
}

export default class Triangle {

  constructor(center, baseColor, options) {
    this.options = fillOptions(options || {});
    this.center = center.clone();
    this.triangle = buildTriangle(this.options.size, center, baseColor);
    this.positionGoal = getRandomVector(this.options.positionSpread, true);
    this.positionVelocity = getRandomVector(0, false);
    this.scaleGoal = getRandomVector(this.options.scaleSpread, false);
    this.scaleVelocity = getRandomVector(0, false);
    this.rotateGoal = getRandomVector(Math.PI, false);
    this.rotateVelocity = getRandomVector(0, false);

    if (this.options.shouldSet) {
      const position = center.clone().add(this.positionGoal);
      this.triangle.position.add(position);
      this.triangle.scale.add(this.scaleGoal);
      this.triangle.rotation.setFromVector3(this.rotateGoal);
    }
    else {
      this.reset();
    }
  }

  reset() {
    this.positionGoal = this.center.clone().add(getRandomVector(this.options.positionSpread, true));
    this.scaleGoal = getRandomVector(this.options.scaleSpread, false);
    this.rotateGoal = getRandomVector(Math.PI, false);
  }

  getMesh() {
    return this.triangle;
  }

  update(elapsedTime) {
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
    return meanDistance;
  }

}
