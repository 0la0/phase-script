import Triangle from './Triangle';


export default class TriangleCluster {

  constructor(numTriangles, center) {
    this.triangles = new Array(numTriangles).fill(null)
      .map(() => new Triangle(10, center));
  }

  reset() {
    this.triangles.forEach(triangle => triangle.reset());
  }

  update(elapsedTime) {
    this.triangles.forEach(triangle => triangle.update(elapsedTime));
  }

  getMesh() {
    return this.triangles.map(triangle => triangle.getMesh());
  }

}
