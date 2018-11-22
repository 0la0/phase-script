import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { GraphicsManager } from './modules/graphicsManager';
import { WebGLRenderer } from 'three';
import graphicsChannel from 'services/GraphicsChannel';
import AnimationScheduler from 'services/AnimationScheduler';

const COMPONENT_NAME = 'graphics-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const NUM_VERTEX = 50;
const LATENCY_MS = 100; // TODO: allow user to adjust latency
export const MESSAGE = {
  SYNC: 'SYNC',
  GRAPHICS_MODE: 'GRAPHICS_MODE',
  TICK: 'TICK',
};

class GraphicsRoot extends BaseComponent {
  constructor() {
    super(style, markup, [ 'canvas', 'fullscreenButton' ]);
    this.graphicsManager = new GraphicsManager();
    this.animationScheduler = new AnimationScheduler();
    this.windowTimeDelta = 0;

    graphicsChannel.subscribe({
      address: MESSAGE.SYNC,
      onNext: baseTime => this.windowTimeDelta = performance.now() - baseTime - LATENCY_MS
    });

    graphicsChannel.subscribe({
      address: MESSAGE.GRAPHICS_MODE,
      onNext: mode => this.graphicsManager.setActiveState(mode),
    });

    graphicsChannel.subscribe({
      address: MESSAGE.TICK,
      onNext: scheduledTime => {
        if (!scheduledTime) {
          this.graphicsManager.onTick();
          return;
        }
        this.animationScheduler.submit(scheduledTime + this.windowTimeDelta);
      },
    });
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
    this.lastRenderTime = performance.now();
    this.addEventListeners();
    this.isInRenderLoop = true;
    this.onResize();
    this.loop();
  }

  loop() {
    const now = performance.now();
    const elapsedTime = (now - this.lastRenderTime) / 1000;
    const animationSchedule = this.animationScheduler.getLatestSchedule(now);
    if (animationSchedule) {
      this.graphicsManager.onTick();
    }
    this.lastRenderTime = now;
    this.graphicsManager.update(elapsedTime);
    this.graphicsManager.render(this.renderer);
    if (this.isInRenderLoop) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  addEventListeners() {
    this.dom.fullscreenButton
      .addEventListener('click', () => this.dom.canvas.webkitRequestFullscreen());
    this.shadowRoot.addEventListener('click', event => this.graphicsManager.onClick(event));
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
