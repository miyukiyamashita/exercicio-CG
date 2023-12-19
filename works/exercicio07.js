import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
    initRenderer,
    initDefaultSpotlight,
    createGroundPlaneXZ,
    SecondaryBox,
    onWindowResize
} from "../libs/util/util.js";

let scene, renderer, light, camera, keyboard;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light    
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
createTeapot(2.0, 0.4, 0.0, Math.random() * 0xffffff);
createTeapot(0.0, 0.4, 2.0, Math.random() * 0xffffff);
createTeapot(0.0, 0.4, -2.0, Math.random() * 0xffffff);

let camPos = new THREE.Vector3(3, 4, 8);
let camUp = new THREE.Vector3(0.0, 0.5, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
camera.lookAt(camLook);

updateCamera();
render();

function updateCamera() {
    // DICA: Atualize a câmera aqui!
    camera.position.copy(camPos);
    camera.up.copy(camUp);
    camera.lookAt(camLook);


    message.changeMessage("Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " +
        "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}");
}

function keyboardUpdate() {
    const valor = 0.5;

    keyboard.update();

    if (keyboard.down("left"))
        camPos.z -= valor;
    if (keyboard.down("right"))
        camPos.z += valor;
    if (keyboard.down("up"))
        camPos.x -= valor;
    if (keyboard.down("down"))
        camPos.x += valor;
    if (keyboard.down("W"))
        camLook.x += valor;
    if (keyboard.down("A"))
        camLook.z -= valor;
    if (keyboard.down("S"))
        camLook.x -= valor;
    if (keyboard.down("D"))
        camLook.z += valor;
    if (keyboard.down("Q"))
        camLook.y += valor;
    if (keyboard.down("E"))
        camLook.y -= valor;
    if (keyboard.down("pageup"))
        camPos.y += valor;
    if (keyboard.pressed("pagedown"))
        camPos.y -= valor;
    // DICA: Insira aqui seu código para mover a câmera

    updateCamera();
}

function createTeapot(x, y, z, color) {
    let geometry = new TeapotGeometry(0.5);
    let material = new THREE.MeshPhongMaterial({ color, shininess: "200" });
    material.side = THREE.DoubleSide;
    let obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.position.set(x, y, z);
    scene.add(obj);
}

function render() {
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
}