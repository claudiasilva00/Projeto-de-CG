import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';

export function createScene() {
    // Criação da scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    const camaraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   // Uso da função create_locker

var locker1 = create_locker(0, 14.05*6, 2);
var locker2 = create_locker(4, 14.05*6, 2);
scene.add(locker1);
scene.add(locker2);



    
    //variaveis 
    let chair, spotLightTarget;

    //luz ambiente 
    const ambientLight = new THREE.AmbientLight(0x888888, 1.5); // intensidade
    scene.add(ambientLight);

    //sol
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    //spotlight
     // Directional light for general illumination
     const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
     directionalLight.position.set(10, 20, 10);
     directionalLight.castShadow = true;
     scene.add(directionalLight);
 
     // Spotlight for chair
     const spotlight = new THREE.SpotLight(0xff0000, 2); // Red light with intensity
     spotlight.position.set(0, 116.5,58); // Position the spotlight above the chair
     //0.9791562630023608, y: 115.7070404093403, z: 60.341531771140225
     spotlight.target.position.set(0, 15*6, 12*6); // Target the chair
     spotlight.angle = Math.PI / 5; // Narrower beam angle
     spotlight.penumbra = 0.1; // Softer edges
     spotlight.decay = 1; // Light decay
     spotlight.distance = 60; // Limit the distance the light reaches
     spotlight.castShadow = true;
     scene.add(spotlight);
     scene.add(spotlight.target);


    var texture_dir = new THREE.TextureLoader().load('./Skybox/posx.jpg');      
    var texture_esq = new THREE.TextureLoader().load('./Skybox/negx.jpg');    
    var texture_up = new THREE.TextureLoader().load('./Skybox/posy.jpg');      
    var texture_dn = new THREE.TextureLoader().load('./Skybox/negy.jpg');      
    var texture_bk = new THREE.TextureLoader().load('./Skybox/posz.jpg');      
    var texture_ft = new THREE.TextureLoader().load('./Skybox/negz.jpg');     

    //array que vai armazenar as texturas
    var materialArray = [];

    //Associar a texturas carrergadas ao array
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dir}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_esq}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));

    //ciclo para fazer com que as texturas do array sejam aplicadas na parte inferior do cubo
    for (var i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;

    //Criação da geometria do skybox
    var skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);

    //Criação da mesh que vai conter a geometria e as texturas
    var skybox = new THREE.Mesh(skyboxGeo, materialArray);

    skybox.position.set(5, 5, 5);

    //adicionar o skybox à scene
    scene.add(skybox);
    //torre principal
    const objLoader = new OBJLoader();
    objLoader.load(
        './Objetos/tower_noDW.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // textura
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
            object.position.y = 0; 
            object.scale.set(2*6, 2*6, 2*6); 
            scene.add(object);

            // muda a posição da câmera
            camaraPerspetiva.position.set(4*6, object.position.y + 16.5*6, 17*6); 
            camaraPerspetiva.lookAt(4, object.position.y + 15, 20);

        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    // cadeira
    const objLoader1 = new OBJLoader();
    objLoader1.load(
        './Objetos/cadeira.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // Apply textures
                    const baseColorMap = new THREE.TextureLoader().load('./Objetos/Textures/t_control/MainRoom_CaptainsChair_Base_Color.tga.png');
                    const metallicMap = new THREE.TextureLoader().load('./Objetos/Textures/t_control/MainRoom_CaptainsChair_Metallic.tga.png');
                    const roughnessMap = new THREE.TextureLoader().load('./Objetos/Textures/t_control/MainRoom_CaptainsChair_Roughness.tga.png');

                    const material = new THREE.MeshStandardMaterial({
                        map: baseColorMap,
                        metalnessMap: metallicMap,
                        roughnessMap: roughnessMap,
                        side: THREE.DoubleSide
                    });

                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.scale.set(0.01*6, 0.01*6, 0.01*6);
            object.position.set(-2*6, 15*6, 16*6);
            scene.add(object);

           
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    // mesa
    const objLoader2 = new OBJLoader();
    objLoader2.load(
        './Objetos/mesa1.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // Apply textures
                    const baseColorMap = new THREE.TextureLoader().load('./Objetos/Textures/t_control/Ship_MainRoom_ControlPanel_Base_Color.png');
                    const metallicMap = new THREE.TextureLoader().load('./Objetos/Textures/t_control/Ship_MainRoom_ControlPanel_Metallic.png');
                    const roughnessMap = new THREE.TextureLoader().load('./Objetos/Textures/t_control/Ship_MainRoom_ControlPanel_Roughness.png');

                    const material = new THREE.MeshStandardMaterial({
                        map: baseColorMap,
                        metalnessMap: metallicMap,
                        roughnessMap: roughnessMap,
                        side: THREE.DoubleSide
                    });

                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.scale.set(0.01*6, 0.01*6, 0.01*6);
            object.position.set(0*6, 14.05*6, 28.5*6);
            scene.add(object);
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    // interuptor
    const objLoader3 = new OBJLoader();
    objLoader3.load(
        './Objetos/lightswitch_obj.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // textura
                    const material = new THREE.MeshStandardMaterial({
                        map: new THREE.TextureLoader().load('./Objetos/textures/lightswitch_D.png'),
                        side: THREE.DoubleSide,
                        emissive: new THREE.Color(0x404040),
                        emissiveIntensity: 0.5
                    });
                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.position.y = 0; 
            object.position.set(0*6, 15.75*6, -3.25*6);
            object.scale.set(2*6, 2*6, 2*6);  
            scene.add(object);

        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    // Load the first OBJ model with its materials
    const objLoader4 = new OBJLoader();
    objLoader4.load(
        './Objetos/lightswitch_obj.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // textura
                    const material = new THREE.MeshStandardMaterial({
                        map: new THREE.TextureLoader().load('./Objetos/textures/lightswitch_D.png'),
                        side: THREE.DoubleSide,
                        emissive: new THREE.Color(0x404040),
                        emissiveIntensity: 0.5
                    });
                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.position.y = 0; 
            object.position.set(0.5*6, 15.75*6, -3.25*6);
                object.scale.set(2*6, 2*6, 2*6);  
            scene.add(object);

        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    //porta
    const objLoader5 = new OBJLoader();
    objLoader5.load(
        './Objetos/door.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // Apply textures
                    const baseColorMap = new THREE.TextureLoader().load('./Objetos/Textures/door/BaseColor.png');
                    const metallicMap = new THREE.TextureLoader().load('./Objetos/Textures/door/Metallic.png');
                    const roughnessMap = new THREE.TextureLoader().load('./Objetos/Textures/door/Roughness.png');

                    const material = new THREE.MeshStandardMaterial({
                        map: baseColorMap,
                        metalnessMap: metallicMap,
                        roughnessMap: roughnessMap,
                        side: THREE.DoubleSide
                    });

                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.scale.set(7*6, 9*6, 8.5*6);
            object.position.set(-6*6, 13.5*6,0.6*6);
            scene.add(object);
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    //porta 2
    const objLoader6 = new OBJLoader();
    objLoader6.load(
        './Objetos/door.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // Apply textures
                    const baseColorMap = new THREE.TextureLoader().load('./Objetos/Textures/door/BaseColor.png');
                    const metallicMap = new THREE.TextureLoader().load('./Objetos/Textures/door/Metallic.png');
                    const roughnessMap = new THREE.TextureLoader().load('./Objetos/Textures/door/Roughness.png');

                    const material = new THREE.MeshStandardMaterial({
                        map: baseColorMap,
                        metalnessMap: metallicMap,
                        roughnessMap: roughnessMap,
                        side: THREE.DoubleSide
                    });

                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.scale.set(7*6, 9*6, 8.5*6) ;
            object.position.set(36.5, 13.5*6,0.6*6);
            scene.add(object);
            
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
        
    );

    const objLoader7 = new OBJLoader();
    objLoader7.load(
        './Objetos/lamp4.obj', 
        function(object) {
            object.traverse(function(child) {
                if (child.isMesh) {
                    // Apply textures
                    const baseColorMap = new THREE.TextureLoader().load('./Objetos/Textures/lamp/plastic_bump_1.jpg');
                    const metallicMap = new THREE.TextureLoader().load('./Objetos/Textures/lamp/brushed_metal 2.jpg');
                    

                    const material = new THREE.MeshStandardMaterial({
                        map: baseColorMap,
                        metalnessMap: metallicMap,
                        
                        side: THREE.DoubleSide
                    });

                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            object.scale.set(1, 1, 1) ;
            object.position.set(0, 116,55);
            object.rotation.y = Math.PI/2;
            scene.add(object);

        

        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }


        
    );

/* OBJETOS COMPLEXOS*/
function create_locker(x, y, z, isDoorOpen = false) {
    var locker = new THREE.Group(); // Grupo para armazenar todas as partes do cacifo

    // Texturas
    var wallTexture = new THREE.TextureLoader().load('./Objetos/Textures/lamp/plastic_bump_1.jpg');
    var doorTexture = new THREE.TextureLoader().load('./Objetos/Textures/lamp/brushed_metal 2.jpg');

    // Função para criar uma parede
    function create_wall(width, height, depth, material) {
        var geometry = new THREE.BoxGeometry(width, height, depth);
        return new THREE.Mesh(geometry, material);
    }

    // Materiais
    var wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
    var doorMaterial = new THREE.MeshPhongMaterial({ map: doorTexture });

    // Espessura das paredes e portas
    var wallThickness = 0.05;
    var doorThickness = 0.02;

    // Dimensões do cacifo
    var lockerWidth = 1;
    var lockerHeight = 4;
    var lockerDepth = 1;

    // Criando as paredes do cacifo
    var leftWall = create_wall(wallThickness, lockerHeight, lockerDepth, wallMaterial);
    leftWall.position.set(-lockerWidth / 2 + wallThickness / 2, lockerHeight / 2, 0);

    var rightWall = create_wall(wallThickness, lockerHeight, lockerDepth, wallMaterial);
    rightWall.position.set(lockerWidth / 2 - wallThickness / 2, lockerHeight / 2, 0);

    var topWall = create_wall(lockerWidth, wallThickness, lockerDepth, wallMaterial);
    topWall.position.set(0, lockerHeight - wallThickness / 2, 0);

    var bottomWall = create_wall(lockerWidth, wallThickness, lockerDepth, wallMaterial);
    bottomWall.position.set(0, wallThickness / 2, 0);

    var backWall = create_wall(lockerWidth, lockerHeight, wallThickness, wallMaterial);
    backWall.position.set(0, lockerHeight / 2, -lockerDepth / 2 + wallThickness / 2);

    // Criando a porta do cacifo
    var door = create_wall(lockerWidth - wallThickness, lockerHeight, doorThickness, doorMaterial);
    door.position.set(0, lockerHeight / 2, lockerDepth / 2 - doorThickness / 2);

    // Adicionando as paredes ao grupo
    locker.add(leftWall);
    locker.add(rightWall);
    locker.add(topWall);
    locker.add(bottomWall);
    locker.add(backWall);

    // Porta aberta
    if (isDoorOpen) {
        // Criar um pivot para a porta
        var doorPivot = new THREE.Object3D();
        doorPivot.position.set(-lockerWidth / 2 + wallThickness / 2, lockerHeight / 2, lockerDepth / 2 - doorThickness / 2);
        door.position.set(lockerWidth / 2 - wallThickness, 0, 0);
        doorPivot.add(door);
        locker.add(doorPivot);
        doorPivot.rotation.y = Math.PI / 2;
    } else {
        locker.add(door);
    }

    // Posição do cacifo
    locker.position.set(x, y, z);

    return locker;

}

    return scene;
}