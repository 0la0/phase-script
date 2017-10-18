import {buildDefaultScene} from 'components/graphics/util';
import {
  MeshBasicMaterial,
  DoubleSide,
  Geometry,
  Vector3,
  Face3,
  Mesh
} from 'three';

const NUM_VERTEX = 50;

export default class TriangleClusters {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;

    this.camera.position.set(0, 0, 100);

    const material = new MeshBasicMaterial({color: 0xFF0000, side: DoubleSide});
    const geometry = new Geometry();
    const v1 = new Vector3(0, 0, 0);
    const v2 = new Vector3(0, 500, 0);
    const v3 = new Vector3(500, 500, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push(new Face3(0, 1, 2));
    this.triangle = new Mesh(geometry, material);
    this.scene.add(this.triangle);
  }

  onClick($event) {
    console.log('triangleClusters onClick');
  }

  update(elapsedTime) {
    this.triangle.rotation.z += 0.01;
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {
    // TODO
  }

  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

}
