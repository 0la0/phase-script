import * as THREE from 'three';
import InstanceMeshModule from 'three-instanced-mesh';
import { buildDefaultScene } from 'components/graphics/util';

const InstancedMesh = InstanceMeshModule( THREE );
const {
  BoxBufferGeometry,
  MeshLambertMaterial,
  PointLight,
  Vector3,
  Euler,
  Quaternion,
  Spherical,
} = THREE;

const getPosNeg = () => Math.random() < 0.5 ? -1 : 1;

function jitter(magnitude = 1) {
  return getPosNeg() * magnitude * Math.random();
}

const TWO_PI = 2 * Math.PI;

const rotation = new Vector3(Math.random() * TWO_PI, Math.random() * TWO_PI, Math.random() * TWO_PI);
const rotationVelocity = new Vector3(Math.random() * TWO_PI, Math.random() * TWO_PI, Math.random() * TWO_PI);

class GeoProperties {
  constructor() {
    this.position;
    this.positionVelocity = new Vector3();
    this.rotation = rotation.clone(),
    this.rotationVelocity = rotationVelocity.clone(),
    this.scale = new Vector3(0.5, 3, 5);
  }
}

const repeatX = 200;
const repeatY = 100;

export default class InstanceSpace {
  constructor() {
    const { camera, scene } = buildDefaultScene();
    this.camera = camera;
    this.scene = scene;
    this.camera.position.set(0, 0, 100);

    this.numInstances = repeatX * repeatY;

    this.geoProperties = new Array(this.numInstances).fill(null).map((_, i) => {
      const x = ((i % repeatX) / repeatX) * TWO_PI + jitter(0.01);
      const y = (i / repeatX) / repeatY * Math.PI + jitter(0.01);

      const geoPosition = new GeoProperties();
      geoPosition.position = new Spherical(60, y, x);
      return geoPosition;
    });

    const geometry = new BoxBufferGeometry(2, 2, 2);
    const material = new MeshLambertMaterial({ color: 0x006699 });

    const _v3 = new Vector3();
    const _q = new Quaternion(1, 0, 0, 1);

    this.cluster = new InstancedMesh(
      geometry,
      material,
      this.numInstances,
      true,  // dynamic
      false, // color
      true,  // uniform scale
    );

    this.geoProperties.forEach((geoProperty, index) => {
      this.cluster.setQuaternionAt(index , _q.setFromEuler(new Euler().setFromVector3(geoProperty.rotation, 'XYZ')));
      this.cluster.setPositionAt(index , _v3.setFromSpherical(geoProperty.position));
      this.cluster.setScaleAt(index , geoProperty.scale );
    });

    this.scene.add(this.cluster);

    const pointLight = new PointLight(0xFFFFFF, 1, 0, 0);
    pointLight.position.set(0, 0, 0);

    const ambientLight = new PointLight(0xFFFFFF, 2);
    ambientLight.position.set(0, 0, 100);
    this.scene.add(pointLight);
    this.scene.add(ambientLight);
  }

  onTick() {
    // this.geoContainer.reset();
  }

  onClick() {
    // this.geoContainer.reset();
  }

  update(elapsedTime) {
    this.geoProperties.forEach((geoProperty, index) => {
      const quat = this.cluster.getQuaternionAt(index);
      geoProperty.rotation.add(geoProperty.rotationVelocity.clone().multiplyScalar(elapsedTime * 0.1));
      this.cluster.setQuaternionAt(index, quat.setFromEuler(new Euler().setFromVector3(geoProperty.rotation, 'XYZ')));
    });
    this.cluster.needsUpdate('quaternion');
  }

  render(renderer) {
    renderer.render(this.scene, this.camera);
  }

  destroy() {
    // TODO
  }

  onResize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
