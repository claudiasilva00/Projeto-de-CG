import * as THREE from 'three';
import { createScene } from './objects.js';
import { PointerLockControls } from 'PointerLockControls';

document.addEventListener('DOMContentLoaded', Start);

//const camara = new THREE.OrthographicCamera(-1, 1, 1, -10, 10);
let cena = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camaraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let ray = new THREE.Raycaster();
let geometry = new THREE.BufferGeometry();
let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x0000ff}));
let points = [];
const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);

let targetPosition = { x: 30, y: 100, z: 100 };
let smoothFactor = 0.01; // Adjust this value to change the smoothness
let keyState = {};

document.addEventListener('click', function() {
    controls.lock();
}, false);

document.addEventListener('keydown', function(event) {
    keyState[event.key] = true;
}, false);

document.addEventListener('keyup', function(event) {
    keyState[event.key] = false;
}, false);

function update_movement() {
    let direction = new THREE.Vector3();
    console.log(camaraPerspetiva.position);
    if (keyState['w']) { // w
        direction.z = -1;
    }
    if (keyState['s']) { // s
        direction.z = 1;
    }
    if (keyState['a']) { // a
        direction.x = -1;
    }
    if (keyState['d']) { // d
        direction.x = 1;
    }
    if (keyState[" "]) { // space
        direction.y = 1;
    }
    if (keyState['Shift']) { // shift
        direction.y = -1;
    }


    // Rotate the direction by the camera's current rotation
    direction.applyQuaternion(camaraPerspetiva.quaternion);

    // Add the direction to the target position
    targetPosition.x += direction.x;
    targetPosition.y += direction.y;
    targetPosition.z += direction.z;
}

function update_raycaster() {
    //update ray direction
    ray.setFromCamera({x: 0, y: 0}, camaraPerspetiva);
    // Add the origin of the raycaster to the points array
    points[0] = ray.ray.origin;
    points[1] = new THREE.Vector3(
        ray.ray.origin.x + ray.ray.direction.x * 50, 
        ray.ray.origin.y + ray.ray.direction.y * 50, 
        ray.ray.origin.z + ray.ray.direction.z * 50
    );
    geometry.setFromPoints(points);
    // Render the scene
}

function loop() {
    update_raycaster();
    update_movement();
    
    // Adjust the camera position by a fraction of the difference
    camaraPerspetiva.position.x +=  (targetPosition.x - camaraPerspetiva.position.x) * smoothFactor;
    camaraPerspetiva.position.y +=  (targetPosition.y - camaraPerspetiva.position.y) * smoothFactor;
    camaraPerspetiva.position.z +=  (targetPosition.z - camaraPerspetiva.position.z) * smoothFactor;


    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}

function Start() {
    requestAnimationFrame(loop)
    renderer.setSize(window.innerWidth, window.innerHeight);
    cena = createScene();
    cena.add(controls.getObject());
    document.body.appendChild(renderer.domElement);
    // Add the origin of the raycaster to the points array
    points.push(ray.ray.origin);
    // Add a point in the direction of the raycaster to the points array
    points.push(new THREE.Vector3(
        ray.ray.origin.x + ray.ray.direction.x * 50, 
        ray.ray.origin.y + ray.ray.direction.y * 50, 
        ray.ray.origin.z + ray.ray.direction.z * 50
    )); 

    geometry.setFromPoints(points);
    
    cena.add(line);
}