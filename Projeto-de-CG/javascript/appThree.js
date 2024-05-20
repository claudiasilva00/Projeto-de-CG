import * as THREE from 'three';

import {PointerLockControls} from 'PointerLockControls';

import {FBXLoader} from 'FBXLoader';



document.addEventListener('DOMContentLoaded',Start);
var objetoImportado;
var mixerAnimacao;
var relogio = new THREE.Clock();
var importer = new FBXLoader();

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1,1,1,-1,-10,10);
var renderer = new THREE.WebGLRenderer();
var camaraPerspetiva = new THREE.PerspectiveCamera(45,4/3,0.1,100);

renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
renderer.setClearColor(0xaaaaaa);
document.body.appendChild(renderer.domElement);

var geometria = new THREE.BufferGeometry();

mesh.translateZ(-6.0);



function loop(){
   
    renderer.render(cena, camaraPerspetiva);
    requestAnimationFrame(loop);
}


const controls = new PointerLockControls(camaraPerspetiva, Renderer.domElement);
controls.addEventListener('lock',function(){});
controls.addEventListener('unlock',function(){});

document.addEventListener('click',function(){
    controls.lock();},false);


document.addEventListener('keydown',ondocumentKeyDown,false);

function ondocumentKeyDown(event){
    var keyCode = event.which;
    if(keyCode == 87){
        controls.moveForward(0.25);

    }else if(keyCode == 83){
        controls.moveForward(-0.25);
    } else if(keyCode == 65){
        controls.moveRight(-0.25);
    } else if(keyCode == 68){
        controls.moveRight(0.25);
    }else if(keyCode == 32){
        if(meshCubo.parent==cena){
            cena.remove(meshCubo);
        }else {
            cena.add(meshCubo);
        }
    }
}

var texture_dir= new THREE.TextureLoader().load('./Skybox/posx.jpg');
var texture_esq= new THREE.TextureLoader().load('./Skybox/negx.jpg');
var texture_cima= new THREE.TextureLoader().load('./Skybox/posy.jpg');
var texture_baixo= new THREE.TextureLoader().load('./Skybox/negy.jpg');
var texture_frente= new THREE.TextureLoader().load('./Skybox/posz.jpg');
var texture_tras= new THREE.TextureLoader().load('./Skybox/negz.jpg');

var material = [
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_dir})),
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_esq})),
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_cima})),
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_baixo})),
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_frente})),
    materialArray.push(new THREE.MeshBasicMaterial({map:texture_tras}))

];

for(var i=0;i<6;i++){
    materialArray[i].side = THREE.BackSide;
}

var skyboxGeo = new THREE.BoxGeometry(100,100,100);

var skybox = new THREE.Mesh(skyboxGeo,materialArray);

cena.add(skybox);


var loader = new THREE.FBXLoader();
loader.load(
    './Objetos/tower1.fbx',
    function(object) {
        scene.add(object);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
        console.log('An error happened: ' + error);
    }
);




function Start(){

   
    renderer.render(cena,camaraPerspetiva);
    requestAnimationFrame(loop);
}