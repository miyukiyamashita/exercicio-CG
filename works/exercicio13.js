import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultSpotlight,
        setDefaultMaterial,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
renderer.setClearColor("rgb(30, 30, 40)");
camera = initCamera(new THREE.Vector3(0, 20, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
material.color.setHex( 0x61b645 ); // set material color
light = initDefaultSpotlight(scene, new THREE.Vector3(25, 30, 20));
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

let ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);
ambientLight.intensity = 0.08;

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(15);
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(30, 30)
scene.add(plane);

const vertCube = [
  -3,   -1,   -1,
   1,   -1,   -1,
   1,    1,   -1,
  -1,    1,   -1,
  -3,   -1,    1,
   1,   -1,    1,
   1,    1,    1,
  -1,    1,    1,
];

const indicesFaces = [
  2, 1, 0, 0, 3, 2,
  0, 4, 7, 7, 3, 0,
  0, 1, 5, 5, 4, 0,
  1, 2, 6, 6, 5, 1,
  2, 3, 7, 7, 6, 2,
  4, 5, 6, 6, 7, 4
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertCube, 3));
geometry.setIndex(indicesFaces);

material = new THREE.MeshBasicMaterial({ color: "#6345b6" });
let cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;

cube.position.set(0.0, 1.0, 0.0);

scene.add(cube);


render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}