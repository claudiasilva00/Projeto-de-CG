import * as THREE from 'three';
import { PointerLockControls } from 'PointerLockControls';
import { OBJLoader } from 'OBJLoader';
document.addEventListener('DOMContentLoaded', Start);

let objetoImportado;
let mixerAnimacao;
const relogio = new THREE.Clock();
const cena = new THREE.Scene();
const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
const renderer = new THREE.WebGLRenderer();
const camaraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0x000000); // Set to black for night effect
document.body.appendChild(renderer.domElement);

const geometria = new THREE.BufferGeometry();

const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement);
cena.add(controls.getObject());

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

document.addEventListener('click', function() {
    controls.lock();
}, false);

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    const keyCode = event.which;
    switch (keyCode) {
        case 87: // w
            moveForward = true;
            break;
        case 83: // s
            moveBackward = true;
            break;
        case 65: // a
            moveLeft = true;
            break;
        case 68: // d
            moveRight = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    const keyCode = event.which;
    switch (keyCode) {
        case 87: // w
            moveForward = false;
            break;
        case 83: // s
            moveBackward = false;
            break;
        case 65: // a
            moveLeft = false;
            break;
        case 68: // d
            moveRight = false;
            break;
    }
}

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 50; // Adjust this value to move at a reasonable speed

function updateMovement(delta) {
    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 50.0 * delta;
        velocity.z -= velocity.z * 50.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        controls.moveRight(-velocity.x *10* delta);
        controls.moveForward(-velocity.z *10* delta);
    }
}

function loop() {
    const delta = relogio.getDelta();
    updateMovement(delta);
    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}

// Add ambient light and spotlights for night effect
const ambientLight = new THREE.AmbientLight(0x888888, 1.5); // Increased ambient light intensity
cena.add(ambientLight);

// Add a directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
cena.add(directionalLight);

// Add a second directional light for better lighting distribution
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-10, 20, -10);
directionalLight2.castShadow = true;
cena.add(directionalLight2);

// Load skybox textures
const loader = new THREE.CubeTextureLoader();
const skyboxTextures = loader.load([
    './Skybox/posx.jpg',
    './Skybox/negx.jpg',
    './Skybox/posy.jpg',
    './Skybox/negy.jpg',
    './Skybox/posz.jpg',
    './Skybox/negz.jpg'
]);

cena.background = skyboxTextures;

// Load OBJ model
const objLoader = new OBJLoader();
objLoader.load(
    './Objetos/tower1.obj', // Path to your OBJ file
    function(object) {
        object.traverse(function(child) {
            if (child.isMesh) {
                // Apply texture to the material
                const material = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load('./Objetos/textures/tower.png'),
                    side: THREE.DoubleSide,
                    emissive: new THREE.Color(0x404040),
                    emissiveIntensity: 0.5
                });
                child.material = material;
                child.material.needsUpdate = true;
            }
        });
        object.position.y = 0; // Adjust Y position if necessary
        object.scale.set(2, 2, 2); // Adjust scale if necessary
        cena.add(object);

        // Place the camera at the specified coordinates
        camaraPerspetiva.position.set(0, object.position.y + 16, 0); // Shortened the camera height
        camaraPerspetiva.lookAt(object.position);

    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
        console.log('An error happened: ' + error);
    }
);

function Start() {
    requestAnimationFrame(loop);
}
