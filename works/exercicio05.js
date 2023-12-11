import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneXZ
} from "../libs/util/util.js";
import { SphereGeometry } from '../build/three.module.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a sphere
let esfera5 = new THREE.SphereGeometry(0.5, 15.0, 25.0);
let esferalets = new THREE.Mesh(esfera5, material);
// position the cube
esferalets.position.set(0.0, 2.0, 2.0);
// add the cube to the scene
// scene.add(cube);

let i;
for (i = 1; i < 13; i++) {

    let raio = 6;
    let angulo = (i / 12) * Math.PI * 2;
    let angle1 = 0;
    
    let esfera5 = new THREE.SphereGeometry(0.5, 10, 15);
    let esferalets = new THREE.Mesh(esfera5, material);

    //esferalets.rotateX(Math.cos(angulo)*raio);
    //esferalets.rotateY(angle1);
    //esferalets.rotateZ(Math.sin(angulo)*raio);

    esferalets.translateX(Math.cos(angulo)*raio);
    esferalets.translateY(1);
    esferalets.translateZ(Math.sin(angulo)*raio);


    scene.add(esferalets);


}

// Use this to show information onscreen
let controls = new InfoBox();
controls.add("Exercício 5");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}