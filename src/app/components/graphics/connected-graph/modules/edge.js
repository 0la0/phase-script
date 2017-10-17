import {
  Geometry,
  LineBasicMaterial,
  Mesh,
  Line
} from 'three';

export default class Edge {

  constructor(v1, v2) {
    const geometry = new Geometry();
    const material = new LineBasicMaterial({
       color: 0xFFFFFF, transparent: true
    });
    const opacity = 0.1 + 0.15 * Math.random();
    material.opacity = opacity;

    this.v1 = v1;
    this.v2 = v2;
    this.p1 = this.v1.getPosition();
    this.p2 = this.v2.getPosition();

    geometry.vertices.push(this.p1);
    geometry.vertices.push(this.p2);
    this.line = new Line(geometry, material);
  }

  update() {
    const p1 = this.v1.getPosition();
    const p2 = this.v2.getPosition();
    this.p1.set(p1.x, p1.y, p1.z);
    this.p2.set(p2.x, p2.y, p2.z);
    this.line.geometry.verticesNeedUpdate = true;
  }

}
