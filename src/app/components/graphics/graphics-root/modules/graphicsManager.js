import ConnectedGraph from 'components/graphics/connected-graph';
import TriangleClusters from 'components/graphics/triangle-clusters';

const options = {
  CONNECTED_GRAPH: 'CONNECTED_GRAPH',
  TRIANGLE_CLUSTERS: 'TRIANGLE_CLUSTERS'
};

function getGraphicsStates() {
  return Object.keys(options);
}

class GraphicsManager {
  constructor() {
    this.map = new Map();
    this.map.set(options.CONNECTED_GRAPH, new ConnectedGraph());
    this.map.set(options.TRIANGLE_CLUSTERS, new TriangleClusters());
    this.activeState = options.TRIANGLE_CLUSTERS;
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
