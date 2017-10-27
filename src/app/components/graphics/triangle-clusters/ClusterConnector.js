import Triangle from './Triangle';
import {lerpVectors} from 'components/graphics/util';

export default class ClusterConnector {

  constructor(numTriangles, point1, point2, color1, color2) {
    this.triangles = new Array(numTriangles).fill(null)
      .map((nullVal, index) => {
        const normalVal = index / numTriangles;
        const center = lerpVectors(point1, point2, normalVal);
        const color = lerpVectors(color1, color2, normalVal);
        const options = {
          shouldSet: true,
          positionSpread: 1,
          scaleSpread: 1.5,
        };
        return new Triangle(center, color, options);
      });
  }

  reset() {
    this.triangles.forEach(triangle => triangle.reset());
  }

  update(elapsedTime) {}

  getMesh() {
    return this.triangles.map(triangle => triangle.getMesh());
  }

}
