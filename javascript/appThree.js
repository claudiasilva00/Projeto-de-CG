import * as THREE from 'three';
import { createScene } from './objects.js';
import { PointerLockControls } from 'PointerLockControls';

document.addEventListener('DOMContentLoaded', Start);

let camara;
let cena = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camaraPerspetiva = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
camaraPerspetiva.position.set(30,100, 100);
const OrthographicCamera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0, 10000);
OrthographicCamera.position.set(0, 1000, 0);
OrthographicCamera.lookAt(0, 0, 0);
OrthographicCamera.updateProjectionMatrix();
let ray = new THREE.Raycaster();
let intersects = [];
let geometry = new THREE.BufferGeometry();
let points = [];
points[0] = new THREE.Vector3(0, 0, 0);
points[1] = new THREE.Vector3(0, 100, 0);
geometry.setFromPoints(points);
let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xff0000}));
let direction = new THREE.Vector3();
const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);
let move = new THREE.Vector3();
let targetPosition = { x: 30, y: 100, z: 100 };
let smoothFactor = 0.035; // Adjust this value to change the smoothness
let keyState = {};



document.addEventListener('click', function() {
    controls.lock();
    if (intersects.length > 0) {
        try {
            console.log(intersects[0].point);
            intersects[0].object.interact();
        }
        catch (error) {
            console.log(error)
        }
    }
}, false);

document.addEventListener('keydown', function(event) {
    keyState[event.key] = true;
    console.log(camaraPerspetiva.position);

    if (event.key === 'c') {change_camera();}
}, false);

document.addEventListener('keyup', function(event) {
    keyState[event.key] = false;
}, false);

function key_bindings() {
    if (keyState['w']) { // w
        move.z = -1;
    }
    if (keyState['s']) { // s
        move.z = 1;
    }
    if (keyState['a']) { // a
        move.x = -1;
    }
    if (keyState['d']) { // d
        move.x = 1;
    }move
    if (keyState[" "]) { // space
        move.y = 1;
    }
    if (keyState['Shift']) { // shift
        move.y = -1;
    }
}

function update_movement() {
    move.applyQuaternion(camaraPerspetiva.quaternion);
    // Add the direction to the target position
    targetPosition.x += move.x;
    targetPosition.y += move.y;
    targetPosition.z += move.z;
    move = new THREE.Vector3();
    // Adjust the camera position by a fraction of the difference
    camaraPerspetiva.position.x +=  (targetPosition.x - camaraPerspetiva.position.x) * smoothFactor;
    camaraPerspetiva.position.y +=  (targetPosition.y - camaraPerspetiva.position.y) * smoothFactor;
    camaraPerspetiva.position.z +=  (targetPosition.z - camaraPerspetiva.position.z) * smoothFactor;
}

function change_camera() {
    if(camara == camaraPerspetiva){
        console.log("perspetiva");
        camara = OrthographicCamera;
    }else{
        console.log("ortografica");
        camara = camaraPerspetiva;
    }
}

function update_raycaster() {
    //update ray direction
    ray.setFromCamera({x: 0, y: 0}, camaraPerspetiva);
    // set the line to start at the camera position and go in the direction of the ray
    points[0] = new THREE.Vector3(camaraPerspetiva.position.x, camaraPerspetiva.position.y, camaraPerspetiva.position.z);
    points[1] = new THREE.Vector3(camaraPerspetiva.position.x + (100 * direction.x), camaraPerspetiva.position.y + (100 * direction.y), camaraPerspetiva.position.z + (100 * direction.z));
    geometry.setFromPoints(points);
    // Get the closest intersection
    intersects = ray.intersectObjects(cena.children);
    if (intersects.length > 0) {
            if ( typeof intersects[0].object.interact === 'function') { 
            // If the object has an interact function, make it shine
            intersects[0].object.material.emissive.set(0x00ff00); // Set the emissive color to green
            intersects[0].object.material.emissiveIntensity = 0.1; // Increase the emissive intensity
            //make the object shine fade out
            new TWEEN.Tween(intersects[0].object.material.emissive)
            .to({ r: 0, g: 0, b: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
            // Show the overlay
            document.getElementById('overlay').style.display = 'block';
            // Hide the overlay after 3 seconds
            setTimeout(function() {
                document.getElementById('overlay').style.display = 'none';
            }, 3000);
        }
    }
}

function get_camara_direction() {
    let direction = new THREE.Vector3();
    camaraPerspetiva.getWorldDirection(direction);
    return direction;
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
  
}


function loop() {
    direction = get_camara_direction();
    cena.children.forEach((child) => {
        try {
        child.material.emissiveIntensity = 0;
        }
        catch (error) {
            //console.log(error);
        }
    });
    key_bindings();
    update_movement();
    update_raycaster();
    cena.OrthographicSphere.rotation.set(camaraPerspetiva.rotation.x, camaraPerspetiva.rotation.y + 90 * (Math.PI / 180), camaraPerspetiva.rotation.z);
    renderer.render(cena, camara);
    requestAnimationFrame(loop);
}

function Start() {
    animate();
    requestAnimationFrame(loop)
    camara = camaraPerspetiva;
    // muda a posição da câmera
    renderer.setSize(window.innerWidth, window.innerHeight);
    cena = createScene();
    cena.add(line);
    cena.OrthographicSphere.position.set(OrthographicCamera.position.x, OrthographicCamera.position.y, OrthographicCamera.position.z);
    document.body.appendChild(renderer.domElement);
}