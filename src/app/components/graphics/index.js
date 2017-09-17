import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import * as THREE from 'three';

const COMPONENT_NAME = 'graphics-root';
const style = require(`./${COMPONENT_NAME}.css`);
const markup = require(`./${COMPONENT_NAME}.html`);

const resizeListeners = new Set();
window.addEventListener('resize', $event => {
  resizeListeners.forEach(component => component.onResize($event));
});

const NUM_VERTEX = 50;

function getPosNeg() {
  return Math.random() < 0.5 ? -1 : 1;
}

class Vertex {

  constructor() {
    const geometry = new THREE.SphereGeometry(0.1, 6, 6);
    const material = new THREE.LineBasicMaterial({
       color: 0xCCCCCC
    });
    // this.dynamic = true;
    this.mesh = new THREE.Mesh(geometry, material);
    this.reset();
  }

  reset() {
    this.mesh.position.set(
      50 * Math.random() - 25,
      50 * Math.random() - 25,
      -50 * Math.random()
    );
    this.velocity = new THREE.Vector3(
      getPosNeg() * 3 * Math.random(),
      getPosNeg() * 3 * Math.random(),
      getPosNeg() * 3 * Math.random()
    );
  }

  getPosition() {
    return this.mesh.position.clone();
  }

  update(elapsedTime) {
    const updatedPosition = this.getPosition().add(
      this.velocity.clone().multiplyScalar(elapsedTime)
    );
    this.mesh.position.set(
      updatedPosition.x,
      updatedPosition.y,
      updatedPosition.z
    );
  }

}

class Edge {

  constructor(v1, v2) {
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({
       color: 0xFFFFFF, transparent: true
    });
    const opacity = 0.1 + 0.15 * Math.random();
    material.opacity = opacity;

    this.v1 = v1;
    this.v2 = v2;
    this.p1 = this.v1.getPosition();
    this.p2 = this.v2.getPosition();

    geometry.vertices.push(this.p1);
    geometry.vertices.push(this.p2);
    this.line = new THREE.Line(geometry, material);
  }

  update() {
    const p1 = this.v1.getPosition();
    const p2 = this.v2.getPosition();
    this.p1.set(p1.x, p1.y, p1.z);
    this.p2.set(p2.x, p2.y, p2.z);
    this.line.geometry.verticesNeedUpdate = true;
  }

}

class GeoContainer {

  constructor(numVertex) {
    this.vertices = new Array(numVertex).fill(null).map(() => new Vertex());

    this.edges = [];
    this.vertices.forEach((vertex, index, array) => {
      const connectingVertices = this.vertices.slice(index + 1);
      connectingVertices.forEach(nextVertex => {
        if (Math.random() < 0.4) {
          this.edges.push(new Edge(vertex, nextVertex));
        }
      });
    });
  }

  getMeshList() {
    const vertices = this.vertices.map(vertex => vertex.mesh);
    const edges = this.edges.map(edge => edge.line);
    return [].concat(vertices, edges);
  }

  update(elapsedTime) {
    [].concat(this.vertices, this.edges).forEach(item => item.update(elapsedTime));
  }

  reset() {
    this.vertices.forEach(vertex => vertex.reset());
  }

}

class GraphicsRoot extends BaseComponent {

  constructor() {
    super(style, markup);
    this.isInRenderLoop = true;
  }

  connectedCallback() {
    resizeListeners.add(this);
    this.graphicsChannel = new BroadcastChannel('GRAPHICS_CHANNEL');
    this.graphicsChannel.addEventListener('message', $event => {
      this.beatNumber = $event.data.beatNumber;
      this.lastBeatNumber = $event.data.lastBeatNumber;
      if ((this.beatNumber + 2) % 4 === 0 && Math.random() < 0.1) {
        this.geoContainer.reset();
      }
    });
    this.isInRenderLoop = true;
    this.root.addEventListener('resize', $event => console.log('resize', $event));

    const canvasElement = this.root.getElementById('cvs');

    this.root.getElementById('fullscreen-button')
      .addEventListener('click', $event => canvasElement.webkitRequestFullscreen());


    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const widthHeightRatio = windowWidth / windowHeight;


    this.geoContainer = new GeoContainer(NUM_VERTEX);

    this.camera = new THREE.PerspectiveCamera(65, widthHeightRatio, 1, 201);
    this.camera.aspect = widthHeightRatio;
    this.camera.position.set(0, 0, 100);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.camera);
    this.geoContainer.getMeshList().forEach(mesh => this.scene.add(mesh));

    this.renderer = new THREE.WebGLRenderer({canvas: canvasElement});
    this.lastRenderTime = performance.now();
    this.onResize();
  }

  disconnectedCallback() {
    this.isInRenderLoop = false;
    this.graphicsChannel.close();
    resizeListeners.delete(this);
  };

  attributeChangedCallback(attribute, oldVal, newVal) {}

  render() {
    const now = performance.now();
    const elapsedTime = (now - this.lastRenderTime) / 1000;
    this.lastRenderTime = now;

    this.geoContainer.update(elapsedTime);
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
