import ConnectedGraph from 'components/graphics/connected-graph';
import TriangleClusters from 'components/graphics/triangle-clusters';
import DisplacedSpheres from 'components/graphics/displaced-spheres';

const options = {
  CONNECTED_GRAPH: 'CONNECTED_GRAPH',
  TRIANGLE_CLUSTERS: 'TRIANGLE_CLUSTERS',
  DISPLACED_SPHERES: 'DISPLACED_SPHERES'
};

function getGraphicsStates() {
  return Object.keys(options);
}

class GraphicsManager {
  constructor() {
    this.map = new Map();
    this.map.set(options.CONNECTED_GRAPH, new ConnectedGraph());
    this.map.set(options.TRIANGLE_CLUSTERS, new TriangleClusters());
    this.map.set(options.DISPLACED_SPHERES, new DisplacedSpheres());
    this.activeState = options.DISPLACED_SPHERES;
  }

  setActiveState(activeState) {
    if (!options[activeState]) {
      console.warn(`activeState ${activeState} not found`);
      return;
    }
    this.activeState = activeState;
  }

  onClick($event) {
    this.map.get(this.activeState).onClick($event);
  }

  onTick(tick) {
    this.map.get(this.activeState).onTick(tick);
  }

  update(elapsedTime) {
    this.map.get(this.activeState).update(elapsedTime);
  }

  render(renderer) {
    this.map.get(this.activeState).render(renderer);
  }

  onResize(aspectRatio) {
    this.map.get(this.activeState).onResize(aspectRatio);
  }

  destroy() {
    // TODO: clean entire three scene
  }
}

export {getGraphicsStates, GraphicsManager};
