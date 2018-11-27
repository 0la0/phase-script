import {buildDefaultScene, getRandomVector} from 'components/graphics/util';
import TriangleCluster from './TriangleCluster';
import ClusterConnector from './ClusterConnector';
import CameraManager from './CameraManager';

export default class TriangleClusters {

  constructor() {
    const defaultScene = buildDefaultScene(400);
    this.totalTime = 0;
    this.scene = defaultScene.scene;
    this.activeIndex = 0;
    this.numClusters = 10;
    this.cameraManager = new CameraManager(defaultScene.camera);
    this.triangleClusters = new Array(this.numClusters).fill(null)
      .map(() => {
        const center = getRandomVector(100, true);
        return new TriangleCluster(30, center);
      });

    this.clusterConnectors = this.triangleClusters
      .map(cluster => {
        return this.triangleClusters
          .filter(otherCluster => otherCluster !== cluster)
          .map(otherCluster => {
            const point1 = cluster.getCenter();
            const point2 = otherCluster.getCenter();
            const color1 = cluster.getColor();
            const color2 = otherCluster.getColor();
            return new ClusterConnector(10, point1, point2, color1, color2);
          });
      })
      .reduce((accumulator, connectorList) => [].concat(accumulator, connectorList), []);

    const clusterMesh = this.triangleClusters.reduce((meshList, triangleCluster) => {
      return [].concat(meshList, triangleCluster.getMesh());
    }, []);
    const connectorMesh = this.clusterConnectors.reduce((meshList, clusterConnector) => {
      return [].concat(meshList, clusterConnector.getMesh());
    }, []);
    const allMesh = [].concat(clusterMesh, connectorMesh);
    this.scene.add(...allMesh);
  }

  onTick() {
    this.onClick();
  }

  onClick() {
    this.triangleClusters[this.activeIndex].reset();
    this.activeIndex = (this.activeIndex + 1 >= this.numClusters) ? 0 : this.activeIndex + 1;
    this.cameraManager.reset();
  }

  update(elapsedTime) {
    this.cameraManager.update(elapsedTime);
    this.triangleClusters.forEach(cluster => cluster.update(elapsedTime));
  }

  render(renderer) {
    renderer.render(this.scene, this.cameraManager.getCamera());
  }

  destroy() {
    // TODO
  }

  onResize(aspectRatio) {
    this.cameraManager.onResize(aspectRatio);
  }

}
