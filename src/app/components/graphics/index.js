import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import * as THREE from 'three';

const COMPONENT_NAME = 'graphics-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

class GraphicsRoot extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isInRenderLoop = true;
  }

  connectedCallback() {
    this.graphicsChannel = new BroadcastChannel('GRAPHICS_CHANNEL');
    this.graphicsChannel.addEventListener('message', $event => {
      this.beatNumber = $event.data.beatNumber;
      this.lastBeatNumber = $event.data.lastBeatNumber;
      // console.log('GRAPHICS_CHANNEL event', $event.data);
    });
    this.isInRenderLoop = true;
    this.addEventListener('resize', $event => {
      this.onResize();
    });

    const canvasElement = this.root.getElementById('cvs');
    console.log(canvasElement, THREE);

    const sphereGeometry = new THREE.SphereGeometry(300, 65, 65);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const widthHeightRatio = windowWidth / windowHeight;

    const sphereMesh = new THREE.Mesh(sphereGeometry);
    sphereMesh.scale.set(-1, 1, 1);
    sphereMesh.name = 'sphereMesh';

    this.camera = new THREE.PerspectiveCamera(65, widthHeightRatio, 1, 301);
    this.camera.aspect = widthHeightRatio;
    this.camera.position.z = 0.001;

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.scene.add(sphereMesh);

    this.renderer = new THREE.WebGLRenderer({canvas: canvasElement});
    this.onResize();
  }

  disconnectedCallback() {
    this.isInRenderLoop = false;
    this.graphicsChannel.close();
  };

  attributeChangedCallback(attribute, oldVal, newVal) {}

  render() {
    console.log('render', this.beatNumber);
    this.renderer.render(this.scene, this.camera);
    if (this.isInRenderLoop) {
      requestAnimationFrame(this.render.bind(this));
    }
  }

  onResize() {
    const DPR = window.devicePixelRatio || 1;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.renderer.setPixelRatio(DPR);
    this.renderer.setSize(windowWidth / DPR, windowHeight / DPR, false);
    this.camera.aspect = windowWidth / windowHeight;
    this.camera.updateProjectionMatrix();
    this.render();
  }

}

export default new Component(COMPONENT_NAME, GraphicsRoot);
