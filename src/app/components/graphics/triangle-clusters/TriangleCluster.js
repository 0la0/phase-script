import Triangle from './Triangle';
import {getRandomVector} from 'components/graphics/util';

const DISTANCE_THRESH = 0.005;

export default class TriangleCluster {

  constructor(numTriangles, center) {
    this.numTriangles = numTriangles;
    this.center = center;
    this.color = getRandomVector(1, false);
    this.triangles = new Array(this.numTriangles).fill(null)
      .map(() => new Triangle(this.center, this.color));
    this.shouldRender = true;
  }

  reset() {
    this.triangles.forEach(triangle => triangle.reset());
    this.shouldRender = true;
  }

  update(elapsedTime) {
    if (!this.shouldRender) {
      return;
    }
    const totalDistance = this.triangles
      .map(triangle => triangle.update(elapsedTime))
      .reduce((sum, distance) => sum + distance, 0);
    const meanDistance = totalDistance / this.numTriangles;
    if (meanDistance <= DISTANCE_THRESH) {
      this.shouldRender = false;
    }
  }

  getMesh() {
    return this.triangles.map(triangle => triangle.getMesh());
  }

  getCenter() {
    return this.center;
  }

  getColor() {
    return this.color;
  }

}
