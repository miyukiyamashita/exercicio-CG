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
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(-30, 40, 30);
camera.up.copy(0, 1, 0);
camera.lookAt(0, 0, 0);

const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);


updateCamera();
render();

// function createCameraObject() {

//     let matBody = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)" });
//     let matLens = new THREE.MeshPhongMaterial({ color: "rgb(255, 255, 0)" });

//     let cBody = new THREE.BoxGeometry(0.2, 0.2, 0.2);
//     let body = new THREE.Mesh(cBody, matBody);

//     let cLens = new THREE.ConeGeometry(0.1, 0.2, 20);
//     let lens = new THREE.Mesh(cLens, matLens);
//     lens.rotateX(THREE.MathUtils.degToRad(90));
//     lens.position.set(0.0, 0.0, -0.1);
//     body.add(lens);

//     scene.add(body);
//     return body;
// }

function updateCamera() {
    // DICA: Atualize a câmera aqui!
    camera.position.copy(camPos);
    camera.up.copy(camUp);
    camera.lookAt(camLook);


    message.changeMessage("Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " +
        "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}");
}
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

function keyboardUpdate() {

    keyboard.update();
    if (keyboard.down("left"))
        cameraHolder.rotateY(-1);
    if (keyboard.down("right"))
        cameraHolder.rotateY(+1);
    if (keyboard.down("up"))
        cameraHolder.rotateX(-1);
    if (keyboard.down("down"))
        cameraHolder.rotateX(+1);
    if (keyboard.down("W"))
        cameraHolder.translateZ(-0.1);
    if (keyboard.down("A"))
        cameraHolder.translateX(-0.1);
    if (keyboard.down("S"))
        cameraHolder.translateZ(+0.1);
    if (keyboard.down("D"))
        cameraHolder.translateX(+0.1);
    if (keyboard.down("Q"))
        cameraHolder.rotateZ(-1);
    if (keyboard.down("E"))
        cameraHolder.rotateZ(+1);
    if (keyboard.down("pageup"))
        cameraHolder.translateY(-1);
    if (keyboard.down("pagedown"))
        cameraHolder.translateY(+1);
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