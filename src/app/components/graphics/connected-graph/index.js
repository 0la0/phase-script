import GeoContainer from './modules/geoContainer';
import {buildDefaultScene} from 'components/graphics/base';

const NUM_VERTEX = 50;

export default class ConnectedGraph {

  constructor() {
    const defaultScene = buildDefaultScene();
    this.camera = defaultScene.camera;
    this.scene = defaultScene.scene;

    this.camera.position.set(0, 0, 100);
    this.geoContainer = new GeoContainer(NUM_VERTEX);
    this.geoContainer.getMeshList().forEach(mesh => this.scene.add(mesh));
  }

  onClick($event) {
    this.geoContainer.reset();
  }

  update(elapsedTime) {
    this.geoContainer.update(elapsedTime);
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
