import {
  PerspectiveCamera,
  Scene,
  Color,
  WebGLRenderer
} from 'three';
import BaseComponent from 'components/_util/base-component';

const resizeListeners = new Set();
window.addEventListener('resize', $event => {
  resizeListeners.forEach(component => component.onResize($event));
});

function buildDefaultScene(canvasElement) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const widthHeightRatio = windowWidth / windowHeight;
  const camera = new PerspectiveCamera(65, widthHeightRatio, 1, 201);
  const scene = new Scene();
  const renderer = new WebGLRenderer({canvas: canvasElement});
  camera.aspect = widthHeightRatio;
  scene.background = new Color(0x000000);
  scene.add(camera);
  return {camera, scene, renderer};
}

export default class GraphicsBase extends BaseComponent {

  constructor(style, markup) {
    super(style, markup);
    const canvasElement = this.root.getElementById('cvs');
    const defaultScene = buildDefaultScene(canvasElement);
    this.camera = defaultScene.camera;
    this.scene = defaultScene.camera;
    this.renderer = defaultScene.renderer;
    this.isInRenderLoop = false;
    this.lastRenderTime = performance.now();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.isInRenderLoop = false;
    // this.graphicsChannel.close();
    resizeListeners.delete(this);
    // TODO: clean entire three scene
  };

  addEventListeners() {
    this.root.getElementById('fullscreen-button')
      .addEventListener('click', $event => canvasElement.webkitRequestFullscreen());
    // this.root.addEventListener('resize', this.onResize.bind(this));
    this.root.addEventListener('click', this.onClick.bind(this));
    // resizeListeners.add(this);
  }

  loop() {
    const now = performance.now();
    const elapsedTime = (now - this.lastRenderTime) / 1000;
    this.lastRenderTime = now;
    this.update(elapsedTime);
    this.render();
    if (this.isInRenderLoop) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  update(elapsedTime) {}

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const DPR = window.devicePixelRatio || 1;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.renderer.setPixelRatio(DPR);
    this.renderer.setSize(windowWidth / DPR, windowHeight / DPR, false);
    this.camera.aspect = windowWidth / windowHeight;
    this.camera.updateProjectionMatrix();
    if (!this.isInRenderLoop) {
      this.loop();
    }
  }

  onClick($event) {}

}
