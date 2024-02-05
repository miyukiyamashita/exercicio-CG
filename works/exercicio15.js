import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  setDefaultMaterial,
  onWindowResize,
  createGroundPlaneXZ
} from "../libs/util/util.js";

import { CSG } from '../libs/other/CSGMesh.js'

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");
camera = initCamera(new THREE.Vector3(0, 20, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
material.color.setHex(0x61b645); // set material color
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);


let lightPosition = new THREE.Vector3(10, 1.9, 10);
let spotLight = new THREE.SpotLight();
setSpotLight(lightPosition, spotLight)

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(30, 30);
scene.add(plane);
let mesh;

buildObjects();
render();

function buildObjects() {
  let auxMat = new THREE.Matrix4();

  let cylinderMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.70, 0.70, 1.9, 20));
  cylinderMesh2.position.set(0.0, 0.1, 0.0);
  updateObject(cylinderMesh2);
  let cylinderCSG2 = CSG.fromMesh(cylinderMesh2);

  let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 2, 20));
  cylinderMesh.position.set(0.0, 0.0, 0.0);
  updateObject(cylinderMesh);
  let cylinderCSG = CSG.fromMesh(cylinderMesh);
  cylinderCSG = cylinderCSG.subtract(cylinderCSG2);

  let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 0.5));
  cubeMesh.position.set(0, 0.1, 0);
  updateObject(cubeMesh);
  let cubeCSG = CSG.fromMesh(cubeMesh);

  let torusMesh = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.15, 20, 20));
  torusMesh.position.set(0.6, 0.0, 0.0);
  updateObject(torusMesh);
  let torusCSG = CSG.fromMesh(torusMesh);
  torusCSG = torusCSG.subtract(cubeCSG);

  let csgObject = cylinderCSG.union(torusCSG);

  mesh = CSG.toMesh(csgObject, auxMat);
  mesh.material = new THREE.MeshPhongMaterial({ color: 'lightblue' });
  mesh.position.set(0, 1, 0);
  scene.add(mesh);

}

function setSpotLight(position, spot) {
  spot.position.copy(position);
  spot.angle = THREE.MathUtils.degToRad(40);
  spot.decay = 2; // The amount the light dims along the distance of the light.
  spot.penumbra = 1; // Percent of the spotlight cone that is attenuated due to penumbra. 

  // Shadow settings
  spot.castShadow = true;
  spot.shadow.mapSize.width = 512;
  spot.shadow.mapSize.height = 512;
  spot.intensity = 0.2

  scene.add(spot);
}

function updateObject(mesh) {
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
}


function render() {
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}