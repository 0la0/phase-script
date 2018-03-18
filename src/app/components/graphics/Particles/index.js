import {buildDefaultScene} from 'components/graphics/util';
// import DisplacedSphere from './DisplacedSphere';
// import {IntArray} from 'components/_util/math';
import {
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from 'three';

export default class Particles {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;

    const geometry = new SphereGeometry(5, 32, 32);
    const material = new MeshBasicMaterial({ color: 0xFF0000 });
    const sphere = new Mesh(geometry, material);
    sphere.position.set(0, 0, -100)
    this.scene.add(sphere);
  }

  onTick(tick) {}

  update(elapsedTime) {}

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {
    // TODO
  }

  onClick() {}

  // TODO: just do this once in graphics manager?
  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

}
