    import * as THREE from 'three';
    import { PointerLockControls } from 'PointerLockControls';
    import { OBJLoader } from 'OBJLoader';
    import { MTLLoader } from 'MTLLoader';
    
    document.addEventListener('DOMContentLoaded', Start);

    let objetoImportado, objetoImportadoOBJ2, objetoImportadoOBJ3,additionalObject, objetoImportadoOBJ4;
    let mixerAnimacao;
    const relogio = new THREE.Clock();
    const cena = new THREE.Scene();
    const camara = new THREE.OrthographicCamera(-1, 1, 1, -10, 10);
    const renderer = new THREE.WebGLRenderer();
    const camaraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer.setSize(window.innerWidth - 15, window.innerHeight - 80);
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
    // document.addEventListener('keyup', onDocumentKeyUp, false);

    function onDocumentKeyDown(event) {
        const keyCode = event.which;
        console.log(camaraPerspetiva.position);
        switch (keyCode) {
            case 87: // w
            controls.moveForward(1)
                break;
            case 83: // s
            controls.moveForward(-1)
                break;
            case 65: // a
            controls.moveRight(-1)
                break;
            case 68: // d
            controls.moveRight(1)
                break;
        }
    }

   /* function handleFPress() {
        if (chairText.visible) {
            chairText.visible = false;
            camaraPerspetiva.position.set(0, 1.6, 0); // Position for sitting in the chair
            camaraPerspetiva.lookAt(objetoImportado.position);
            deskText.visible = true;
        } else if (deskText.visible) {
            deskText.visible = false;
            // Add functionality for opening the command desk if needed
            alert('Command desk opened!');
        }
    }*/

    function loop() {
        const delta = relogio.getDelta();
       // updateMovement(delta);
        renderer.render(cena, camaraPerspetiva);
        requestAnimationFrame(loop);
    }

    //luz ambiente 
    const ambientLight = new THREE.AmbientLight(0x888888, 1.5); // intensidade
    cena.add(ambientLight);

    //sol
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    cena.add(directionalLight);

    // mas uma luz
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-10, 20, -10);
    directionalLight2.castShadow = true;
    cena.add(directionalLight2);
                         

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

//adicionar o skybox à cena
cena.add(skybox);

    //torre principal
    const objLoader = new OBJLoader();
    objLoader.load(
        './Objetos/tower_noD.obj', 
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
            cena.add(object);

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
        cena.add(object);
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
        cena.add(object);
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
         cena.add(object);

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
          cena.add(object);
 
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
        cena.add(object);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
        console.log('An error happened: ' + error);
    }
);//porta
const objLoader6 = new OBJLoader();
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
      object.scale.set(7*6, 9*6, 8.5*6) ;
      object.position.set(6*6, 13.5*6,0.6*6);
      cena.add(object);
      
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
