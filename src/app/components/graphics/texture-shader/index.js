import { buildDefaultScene } from 'components/graphics/util';
import TexturePlane from './TexturePlane';
import vertexShader from './shaders/displace.vert';
import fragmentShader from './shaders/displace.frag';

export default class Texture {
  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;
    this.texturePlane = new TexturePlane(vertexShader, fragmentShader);
    this.scene.add(this.texturePlane.getMesh());
    this.camera.position.set(0, 0, 50);
    this.totalTime = 0;
  }

  onTick() {}

  update(elapsedTime) {
    this.totalTime = this.totalTime + elapsedTime;
    this.texturePlane.update(elapsedTime, this.totalTime);
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {}

  onClick() {}

  activateRandomSphere() {}

  // TODO: just do this once in graphics manager?
  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
