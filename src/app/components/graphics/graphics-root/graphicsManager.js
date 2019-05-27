import ConnectedGraph from 'components/graphics/connected-graph';
import DisplacedSpheres from 'components/graphics/displaced-spheres';
import Particles from 'components/graphics/Particles';
import TriangleClusters from 'components/graphics/triangle-clusters';
import WaterSpheres from 'components/graphics/water-spheres';
import TextureShader from 'components/graphics/texture-shader';
import InstanceSpace from 'components/graphics/instance-space';

const options = {
  CONNECTED_GRAPH: {
    label: 'connected graph',
    value: 'CONNECTED_GRAPH'
  },
  DISPLACED_SPHERES: {
    label: 'displaced spheres',
    value: 'DISPLACED_SPHERES'
  },
  PARTICLES: {
    label: 'particles',
    value: 'PARTICLES'
  },
  TRIANGLE_CLUSTERS: {
    label: 'triangle clusers',
    value: 'TRIANGLE_CLUSTERS'
  },
  WATER_SPHERES: {
    label: 'water spheres',
    value: 'WATER_SPHERES'
  },
  TEXTURE_SHADER: {
    label: 'texture shader',
    value: 'TEXTURE_SHADER',
  },
  INSTANCE_SPACE: {
    label: 'instance space',
    value: 'INSTANCE_SPACE',
  },
};

function getGraphicsStates() {
  return Object.values(options);
}

class GraphicsManager {
  constructor() {
    this.map = new Map();
    this.map.set(options.CONNECTED_GRAPH.value, new ConnectedGraph());
    this.map.set(options.DISPLACED_SPHERES.value, new DisplacedSpheres());
    this.map.set(options.PARTICLES.value, new Particles());
    this.map.set(options.TRIANGLE_CLUSTERS.value, new TriangleClusters());
    this.map.set(options.WATER_SPHERES.value, new WaterSpheres());
    this.map.set(options.TEXTURE_SHADER.value, new TextureShader());
    this.map.set(options.INSTANCE_SPACE.value, new InstanceSpace());
    this.activeState = options.INSTANCE_SPACE.value;
  }

  setActiveState(activeState) {
    if (!options[activeState]) {
      throw new Error(`Graphics state ${activeState} not found`);
    }
    this.activeState = activeState;
  }

  onClick($event) {
    this.map.get(this.activeState).onClick($event);
  }

  onTick(tick) {
    this.map.get(this.activeState).onTick(tick);
  }

  setFftArray() {
    // TODO: send to graphics consumer
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
