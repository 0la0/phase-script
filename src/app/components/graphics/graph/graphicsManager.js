import ConnectedGraph from 'components/graphics/connected-graph';
import TriangleClusters from 'components/graphics/triangle-clusters';

export default class GraphicsManager {
  constructor() {
    this.options = {
      CONNECTED_GRAPH: 'CONNECTED_GRAPH',
      TRIANGLE_CLUSTERS: 'TRIANGLE_CLUSTERS'
    };
    this.map = new Map();
    this.map.set(this.options.CONNECTED_GRAPH, new ConnectedGraph());
    this.map.set(this.options.TRIANGLE_CLUSTERS, new TriangleClusters());
    this.activeState = this.options.CONNECTED_GRAPH;
  }

  getStates() {
    return [...this.options.keys()];
  }

  setActiveState(activeState) {
    if (!this.options[activeState]) {
      console.warn(`activeState ${activeState} not found`);
      return;
    }
    this.activeState = activeState;
  }

  onClick($event) {
    this.map.get(this.activeState).onClick($event);
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
