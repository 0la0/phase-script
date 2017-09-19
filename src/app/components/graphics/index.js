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

function getRandomVector() {
  return new THREE.Vector3(
    getPosNeg() * Math.random(),
    getPosNeg() * Math.random(),
    getPosNeg() * Math.random()
  );
}

class Vertex {

  constructor() {
    const geometry = new THREE.SphereGeometry(0.1, 6, 6);
    const material = new THREE.LineBasicMaterial({
       color: 0xCCCCCC
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.reset();
  }

  reset() {
    const centroid = this.goal = new THREE.Vector3(
      150 * getPosNeg() * Math.random(),
      150 * getPosNeg() * Math.random(),
     -300 * Math.random()
    );
    this.goal = new THREE.Vector3(
      centroid.x * Math.random(),
      centroid.y * Math.random(),
      centroid.z * Math.random(),
    );
    this.velocity = new THREE.Vector3(
      5000 * getPosNeg() * Math.random(),
      5000 * getPosNeg() * Math.random(),
      5000 * getPosNeg() * Math.random()
    );
  }

  getPosition() {
    return this.mesh.position.clone();
  }

  update(elapsedTime) {
    this.mesh.position.add(
      this.goal.clone()
        .sub(this.getPosition())
        .multiplyScalar(30 * Math.random() * elapsedTime)
    );
  }

  getDistance() {
    return this.goal.clone().sub(this.getPosition()).length();
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
      if ((this.beatNumber + 2) % 4 === 0 && Math.random() < 0.5) {
        this.geoContainer.reset();
      }
    });
    this.isInRenderLoop = true;
    this.root.addEventListener('resize', $event => console.log('resize', $event));
    this.root.addEventListener('click', $event => this.geoContainer.reset());

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
