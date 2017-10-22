import {buildDefaultScene} from 'components/graphics/util';
// import Triangle from './Triangle';
import TriangleCluster from './TriangleCluster';
import {
  // MeshBasicMaterial,
  // DoubleSide,
  // Geometry,
  // Vector3,
  // Face3,
  // Mesh
} from 'three';


export default class TriangleClusters {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;

    this.camera.position.set(0, 0, 100);

    this.triangleCluster = new TriangleCluster(10);
    // this.triangle = new Triangle(10);
    // this.scene.add(this.triangle.getMesh());
    // this.scene.add(this.triangle.getGoal());
    this.scene.add(...this.triangleCluster.getMesh());
  }

  onClick($event) {
    console.log('triangleClusters onClick');
    // this.triangle.createGoal();
    this.triangleCluster.reset();
  }

  update(elapsedTime) {
    // this.triangle.rotation.z += 0.01;
    // this.triangle.getMesh().rotation.z += 0.01;
    // this.triangle.update(elapsedTime);
    this.triangleCluster.update(elapsedTime);
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
