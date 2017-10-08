import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import GeoContainer from './modules/geoContainer';
import GraphicsBase from 'components/graphics/base';

const COMPONENT_NAME = 'graphics-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

// const resizeListeners = new Set();
// window.addEventListener('resize', $event => {
//   resizeListeners.forEach(component => component.onResize($event));
// });

const NUM_VERTEX = 50;

class GraphicsRoot extends GraphicsBase {

  constructor() {
    super(style, markup);
  }

  connectedCallback() {
    // resizeListeners.add(this);
    this.graphicsChannel = new BroadcastChannel('GRAPHICS_CHANNEL');
    this.graphicsChannel.addEventListener('message', $event => {
      this.beatNumber = $event.data.beatNumber;
      this.lastBeatNumber = $event.data.lastBeatNumber;
      if ((this.beatNumber + 2) % 4 === 0 && Math.random() < 0.5) {
        this.geoContainer.reset();
      }
    });
    this.isInRenderLoop = true;
    this.camera.position.set(0, 0, 100);

    this.geoContainer = new GeoContainer(NUM_VERTEX);
    this.geoContainer.getMeshList().forEach(mesh => this.scene.add(mesh));
    this.onResize();
    this.loop();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // this.isInRenderLoop = false;
    this.graphicsChannel.close();
    // resizeListeners.delete(this);
    // TODO: clean entire three scene
  };

  onClick($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.geoContainer.reset();
  }

  update(elapsedTime) {
    this.geoContainer.update(elapsedTime);
  }

}

export default new Component(COMPONENT_NAME, GraphicsRoot);
