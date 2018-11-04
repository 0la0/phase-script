import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import graphicsChannel from 'services/BroadcastChannel';
import { GraphicsManager } from './modules/graphicsManager';
import { WebGLRenderer } from 'three';

const COMPONENT_NAME = 'graphics-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const NUM_VERTEX = 50;

const dom = [ 'canvas', 'fullscreenButton' ];

class GraphicsRoot extends BaseComponent {
  constructor() {
    super(style, markup, dom);
  }

  connectedCallback() {
    setTimeout(this.init.bind(this)); // let dom update before loading graphics
  }

  disconnectedCallback() {
    this.isInRenderLoop = false;
    // this.graphicsChannel.close(); // TODO
    this.graphicsManager.destroy();
    window.removeEventListener('resize', this.onResizeListener);
  };

  init() {
    this.renderer = new WebGLRenderer({canvas: this.dom.canvas, alpha: false, antialias: false});
    this.graphicsManager = new GraphicsManager();
    this.lastRenderTime = performance.now();
    this.addEventListeners();
    this.isInRenderLoop = true;
    this.onResize();
    this.loop();
  }

  loop() {
    const now = performance.now();
    const elapsedTime = (now - this.lastRenderTime) / 1000;
    this.lastRenderTime = now;
    this.graphicsManager.update(elapsedTime);
    this.graphicsManager.render(this.renderer);
    if (this.isInRenderLoop) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  addEventListeners() {
    this.dom.fullscreenButton
      .addEventListener('click', $event => this.dom.canvas.webkitRequestFullscreen());
    this.shadowRoot.addEventListener('click', $event => this.graphicsManager.onClick($event));

    graphicsChannel.addEventListener('message', event => {
      const type = event.data.type;
      if (type === 'GRAPHICS_MODE') {
        const graphicsState = event.data.value;
        this.graphicsManager.setActiveState(graphicsState);
      }
      else if (type === 'TICK') {
        this.graphicsManager.onTick(event.data);
      }
      else if (type === 'FFT') {
        this.graphicsManager.setFftArray(event.data);
      }
    });

    this.onResizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.onResizeListener);
  }

  onResize() {
    const DPR = window.devicePixelRatio || 1;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = windowWidth / windowHeight;
    this.renderer.setPixelRatio(DPR);
    this.renderer.setSize(windowWidth / DPR, windowHeight / DPR, false);
    this.graphicsManager.onResize(aspectRatio);
    if (!this.isInRenderLoop) {
      this.loop();
    }
  }
}

export default new Component(COMPONENT_NAME, GraphicsRoot);
