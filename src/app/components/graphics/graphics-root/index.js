import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { GraphicsManager } from './modules/graphicsManager';
import { WebGLRenderer } from 'three';
import graphicsChannel from 'services/GraphicsChannel';

const COMPONENT_NAME = 'graphics-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const NUM_VERTEX = 50;
export const MESSAGE = {
  SYNC: 'SYNC',
  GRAPHICS_MODE: 'GRAPHICS_MODE',
};

class GraphicsRoot extends BaseComponent {
  constructor() {
    super(style, markup, [ 'canvas', 'fullscreenButton' ]);
    this.graphicsManager = new GraphicsManager();
    this.windowTimeDelta = 0;
    this.tickSchedules = [];

    graphicsChannel.subscribe({
      address: 'SYNC',
      onNext: baseTime => this.windowTimeDelta = performance.now() - baseTime
    });

    graphicsChannel.subscribe({
      address: 'GRAPHICS_MODE',
      onNext: mode => this.graphicsManager.setActiveState(mode),
    });

    graphicsChannel.subscribe({
      address: 'TICK',
      onNext: scheduledTime => {
        if (!scheduledTime) {
          this.graphicsManager.onTick();
          return;
        }
        this.tickSchedules.push(scheduledTime + this.windowTimeDelta);
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

  // TODO: move to module
  getLatestEventSchedule(now) {
    if (!this.tickSchedules.length) {
      return false;
    }
    if (this.tickSchedules[0] > now) {
      return false;
    }
    if (this.tickSchedules.length === 1) {
      return this.tickSchedules.pop();
    }
    let i = 1;
    while (i < this.tickSchedules.length) {
      if (this.tickSchedules[i] > now) {
        const latestSchedule = this.tickSchedules[i - 1];
        this.tickSchedules.splice(0, i);
        return latestSchedule;
      }
    }
    return false;
  }

  loop() {
    const now = performance.now();
    const elapsedTime = (now - this.lastRenderTime) / 1000;
    const latestEventSchedule = this.getLatestEventSchedule(now);
    if (latestEventSchedule) {
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
