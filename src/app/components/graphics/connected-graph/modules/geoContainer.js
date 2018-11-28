import Vertex from './vertex';
import Edge from './Edge';

export default class GeoContainer {

  constructor(numVertex) {
    this.vertices = new Array(numVertex).fill(null).map(() => new Vertex());

    this.edges = [];
    this.vertices.forEach((vertex, index) => {
      const connectingVertices = this.vertices.slice(index + 1);
      connectingVertices.forEach(nextVertex => {
        if (Math.random() < 0.4) {
          this.edges.push(new Edge(vertex, nextVertex));
        }
      });
    });
  }

  getMeshList() {
    const vertices = this.vertices.map(vertex => vertex.mesh);
    const edges = this.edges.map(edge => edge.line);
    return [].concat(vertices, edges);
  }

  update(elapsedTime) {
    [].concat(this.vertices, this.edges).forEach(item => item.update(elapsedTime));
  }

  reset() {
    this.vertices.forEach(vertex => vertex.reset());
  }

}
