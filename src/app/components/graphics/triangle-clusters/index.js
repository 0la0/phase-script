import {buildDefaultScene, getRandomVector} from 'components/graphics/util';
import TriangleCluster from './TriangleCluster';
import {Vector3} from 'three';

export default class TriangleClusters {

  constructor() {
    const defaultScene = buildDefaultScene(400);
    this.totalTime = 0;
    this.camera = defaultScene.camera;
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.scene = defaultScene.scene;
    this.camera.position.set(0, 0, 100);
    this.activeIndex = 0;
    this.numClusters = 20;
    this.triangleClusters = new Array(this.numClusters).fill(null)
      .map(() => {
        const center = getRandomVector(80, true)
        return new TriangleCluster(30, center);
      });

    const allMesh = this.triangleClusters.reduce((meshList, triangleCluster) => {
      return [].concat(meshList, triangleCluster.getMesh());
    }, []);
    console.log('allMesh', allMesh);
    this.scene.add(...allMesh);
  }

  onClick($event) {
    this.triangleClusters[this.activeIndex].reset();
    this.activeIndex = (this.activeIndex + 1 >= this.numClusters) ? 0 : this.activeIndex + 1;
  }

  update(elapsedTime) {
    this.updateCamera(elapsedTime);
    this.triangleClusters.forEach(cluster => cluster.update(elapsedTime));
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  updateCamera(elapsedTime) {
    this.totalTime += elapsedTime * 0.1;
    this.camera.position.x = Math.sin(this.totalTime) * 160;
    this.camera.position.y = Math.cos(this.totalTime) * 80;
    this.camera.position.z = Math.cos(this.totalTime) * 160;
    this.camera.lookAt(new Vector3(0, 0, 0));
  }

  destroy() {
    // TODO
  }

  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

}
