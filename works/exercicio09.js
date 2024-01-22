import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import GUI from '../libs/util/dat.gui.module.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 20, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(30, 30)
scene.add(plane);

// create a sphere
let esfera = new THREE.SphereGeometry(2, 17, 45);
let material3 = new THREE.MeshBasicMaterial({ color: 0x9400d3 });
let sphere1 = new THREE.Mesh(esfera, material3);

sphere1.position.set(-5.0, 2.5, -6.0);

scene.add(sphere1);

let esfera2 = new THREE.SphereGeometry(2, 17, 45);
let material2 = new THREE.MeshBasicMaterial({ color: 0x9400d3 });
let sphere2 = new THREE.Mesh(esfera2, material2);

sphere2.position.set(-5.0, 2.5, 6.0);

scene.add(sphere2);

const lerpConfig = {
    destination: new THREE.Vector3(5, 2.5, -6),
    destination2: new THREE.Vector3(5, 2.5, 6),
    alpha: 0.05,
    alpha2: 0.02,
    move: false,
    move2: false

}

const reset = () => {
    lerpConfig.destination = {x: -5.0, y: 2.5, z: -6.0};
    lerpConfig.destination2 = {x: -5.0, y: 2.5, z: 6.0};

}

document.getElementById('btnSphere1').addEventListener('click', () => {
    lerpConfig.destination = {x: -5.0, y: 2.5, z: -6.0};
    lerpConfig.move = true;

})

document.getElementById('btnSphere2').addEventListener('click', () => {
    lerpConfig.destination2 = {x: -5.0, y: 2.5, z: 6.0};
    lerpConfig.move2 = true;

})

document.getElementById('btnReset').addEventListener('click', () => {
    reset();

})

render();
function render() {

    lerpConfig.move ? sphere1.position.lerp(lerpConfig.destination, lerpConfig.alpha): 0;
    lerpConfig.move2 ? sphere2.position.lerp(lerpConfig.destination2, lerpConfig.alpha2): 0;


    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}