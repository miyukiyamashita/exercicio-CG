import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initDefaultSpotlight,
    initCamera,
    createGroundPlane,
    onWindowResize
} from "../libs/util/util.js";

let scene = new THREE.Scene();    // Create main scene
let renderer = initRenderer();    // View function in util/utils
let light = initDefaultSpotlight(scene, new THREE.Vector3(7.0, 7.0, 7.0), 300);
let camera = initCamera(new THREE.Vector3(3.6, 4.6, 8.2)); // Init camera in this position
let trackballControls = new TrackballControls(camera, renderer.domElement);

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlane(10, 10, 40, 40);
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
    destination: new THREE.Vector3(0.0, 0.2, 0.0),
    move: true

}

var vel = 0;
var vel2 = 0;
var speed = 0.05;


buildInterface();

function buildInterface() {
    let gui = new GUI();
    let folder = gui.addFolder("Lerp Options");
    folder.open();
    folder.add(lerpConfig.destination, 'Esfera 1', vel += speed).onChange();
    folder.add(lerpConfig.destination, 'Esfera 2', vel2 += speed*2).onChange();
    folder.add(lerpConfig.destination, 'Reset', 0, 0).onChange();
    folder.add(lerpConfig, "move", true)
        .name("Move Object");


}

function render() {
    trackballControls.update();

    if (lerpConfig.move) obj.position.lerp(lerpConfig.destination, lerpConfig.alpha);

    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}