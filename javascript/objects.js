import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';

export function createScene() {
    // Criação da scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    const camaraPerspetiva = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   // Uso da função create_locker

var locker1 = create_locker(-35, 13.85*6, 18);
var locker2 = create_locker(-35, 13.85*6, 28);
scene.add(locker1);
scene.add(locker2);


 // Adicionar a ventoinha de teto à cena

 

  // Usage example
  
  const { fan, rotateFanBlades } = createFan();
  scene.add(fan);
  fan.scale.set(2, 2, 2);
  fan.position.set(0, 19.9*6, 8); // Ajustar a posição conforme necessário



    
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
    var skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);

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
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    // cadeira
    objLoader.load(
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
    objLoader.load(
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
    objLoader.load(
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
    objLoader.load(
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
    objLoader.load(
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
                    child.geometry.translate( 0, 0, 0.1 );
                    child.name = 'door_left';
                    child.open = false; // State of the door
                    child.interact = function() {
                        if (!child.open) {
                            new TWEEN.Tween(child.rotation)
                            .to({ y: Math.PI / -2 }, 1000) // Rotate the door to 90 degrees (open position) in 1 second
                            .start()
                            .onStart(function() {
                                console.log('Door opening');
                                //doorSound.play(); // Play the door opening sound
                              })
                            .onComplete(function () {
                                child.open = true; // Update the state
                            });
                            
                        } else {
                            new TWEEN.Tween(child.rotation)
                            .to({ y: 0 }, 1000) // Rotate the door to 0 degrees (closed position) in 1 second
                            .start()
                            .onStart(function() {
                                console.log('Door closing');
                                //cdoorSound.play(); // Play the door closing sound
                            })
                            .onComplete(function () {
                                child.open = false; // Update the state
                            });
                        }
                    }
                }
            });
            object.scale.set(7*6, 9*6, 8.5*6);
            object.position.set(-6*6, 13.5*6,-1.5);
            scene.add(object);
            scene.door_left = object;
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
    );
    
    //porta 2
    objLoader.load(
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
                    child.geometry.translate( 0, 0, 0.1 );
                    child.name = 'door_right';
                    child.open = false; // State of the door
                    child.interact = function() {
                        if (!child.open) {
                            new TWEEN.Tween(child.rotation)
                            .to({ y: Math.PI / -2 }, 1000) // Rotate the door to 90 degrees (open position) in 1 second
                            .start()
                            .onStart(function() {
                                console.log('Door opening');
                                //doorSound.play(); // Play the door opening sound
                              })
                            .onComplete(function () {
                                child.open = true; // Update the state
                            });
                            
                        } else {
                            new TWEEN.Tween(child.rotation)
                            .to({ y: 0 }, 1000) // Rotate the door to 0 degrees (closed position) in 1 second
                            .start()
                            .onStart(function() {
                                console.log('Door closing');
                                //cdoorSound.play(); // Play the door closing sound
                            })
                            .onComplete(function () {
                                child.open = false; // Update the state
                            });
                        }
                    }
                }
            });
            object.scale.set(7*6, 9*6, 8.5*6) ;
            object.position.set(36.5, 13.5*6,-1.5);
            scene.add(object);
            scene.door_right = object;
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error) {
            console.log('An error happened: ' + error);
        }
        
    );

    objLoader.load(
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
var holder = create_holder();
    holder.position.set(-35, 17.75 * 6, 18); // Adjust the position as needed
    scene.add(holder);


 

    function createFan() {
        const fan = new THREE.Group();
    
        // Materiais
        var texture = new THREE.TextureLoader().load('./Objetos/textures/old-metalH.jpg');
        var texture1 = new THREE.TextureLoader().load('./Objetos/textures/old-metalB.jpg');
        var texture2 = new THREE.TextureLoader().load('./Objetos/textures/old-wood.jpg');
        var texture3 = new THREE.TextureLoader().load('./Objetos/textures/old-metal.png');
        var texture4 = new THREE.TextureLoader().load('./Objetos/textures/thread.jgp');


        // Create the central motor   
        const motorGeometry = new THREE.CylinderGeometry(0.75, 0.75, 3, 40);
        //var motorMaterial = new THREE.MeshStandardMaterial({ map:texture});
        const motorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const motor = new THREE.Mesh(motorGeometry, motorMaterial);
        motor.position.y = -1; // Adjust position to be closer to the ceiling
        fan.add(motor);

        const motor2Geometry = new THREE.CylinderGeometry(1, 1, 0.2, 40);
        //var motor2Material = new THREE.MeshStandardMaterial({ map:texture1});
        const motor2Material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const motor2 = new THREE.Mesh(motor2Geometry, motor2Material);
        motor2.position.y = -2.25; // Adjust position to be closer to the ceiling
        fan.add(motor2);

        const motor3Geometry = new THREE.CylinderGeometry(1, 1, 0.2, 40);
        //var motor3Material = new THREE.MeshStandardMaterial({ map:texture1});
        const motor3Material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const motor3 = new THREE.Mesh(motor3Geometry, motor3Material);
        motor3.position.y = -1.75; // Adjust position to be closer to the ceiling
        fan.add(motor3);

        //create the turning on/off wire
        const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 40);
        var wireMaterial = new THREE.MeshStandardMaterial({ map:texture1});
        const wire = new THREE.Mesh(wireGeometry, wireMaterial);
        wire.position.y = -4.75; // Adjust position to be closer to the ceiling
        wire.position.x = 0.85; // Adjust position to be closer to the ceiling
        fan.add(wire);
        wire.scale.set(1, 1, 1);

        //sphere to hold the wire
        const sphereGeometry = new THREE.SphereGeometry(0.5, 40, 40);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.y = -7; // Adjust position to be closer to the ceiling
        sphere.position.x = 0.8; // Adjust position to be closer to the ceiling
        fan.add(sphere);
        sphere.scale.set(0.3, 0.3, 0.3);

        // light sphere 
        const lightGeometry = new THREE.SphereGeometry(1, 40, 40, 0, Math.PI, 0, Math.PI);
        const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = -2.25; // Adjust position to be closer to the ceiling
        light.position.x = 0; // Adjust position to be closer to the ceiling
        light.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2); // Rotate the light to be horizontal
        fan.add(light);
        light.scale.set(0.85, 0.85, 0.85);

      
        








    
        // Create the blades
        const bladeGeometry = new THREE.BoxGeometry(12, 0.2, 1.2);

        //var bladeMaterial = new THREE.MeshStandardMaterial({ map:texture2});
        const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xDDDDDD });
      
    
        // Function to create and position blades
        function createBlade(rotationAngle) {
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.position.set(0, -2, 0); // Position blade end at rotation axis
            blade.rotation.y = rotationAngle; // Rotate blade to the correct angle
            return blade;
        }
    
        const blade1 = createBlade(0); // Blade 1
        const blade2 = createBlade(Math.PI / 2); // Blade 2 (90 degrees)
        const blade3 = createBlade(Math.PI); // Blade 3 (180 degrees)
        const blade4 = createBlade(3 * Math.PI / 2); // Blade 4 (270 degrees)
    
        if (blade1) fan.add(blade1);
        if (blade2) fan.add(blade2);
        if (blade3) fan.add(blade3);
        if (blade4) fan.add(blade4);
    
        // Rotate the fan blades over time
        const rotateFanBlades = () => {
            fan.rotation.y += 0.01;
        };
    
        return { fan, rotateFanBlades };
    }
    
  
function create_locker(x, y, z, isDoorOpen = false) {
    var locker = new THREE.Group(); // Grupo para armazenar todas as partes do cacifo

    // Texturas
    var wallTexture = new THREE.TextureLoader().load('./Objetos/Textures/old-metal.jpg');
    var doorTexture = new THREE.TextureLoader().load('./Objetos/Textures/old-metalDR.jpg');
    var handleTexture = new THREE.TextureLoader().load('./Objetos/Textures/old-metalH.jpg'); // Textura da maçaneta

    // Função para criar uma parede
    function create_wall(width, height, depth, material) {
        var geometry = new THREE.BoxGeometry(width, height, depth);
        return new THREE.Mesh(geometry, material);
    }

    

    // Função para criar a maçaneta
    function create_handle() {
       

        var handle = new THREE.Group(); // Group to store all parts of the holder
    

        // Textures
        var metalTexture = new THREE.TextureLoader().load('./Objetos/Textures/old-metalH.jpg'); // Assuming the texture for metal
    
        // Function to create a cylindrical rod
        function create_rod(radius, height, material) {
            var geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
            return new THREE.Mesh(geometry, material);
        }
    
        // Materials
        var metalMaterial = new THREE.MeshPhongMaterial({ map: metalTexture });
    
        // Dimensions
        var rodRadius = 0.25;
        var verticalRodHeight = 2;
        var horizontalRodLength = 6;
    
    
        
    
        // Creating the vertical rods
        var leftVerticalRod = create_rod(rodRadius, verticalRodHeight, metalMaterial);
        leftVerticalRod.position.set(-horizontalRodLength / 3, verticalRodHeight / 2 + 0.05 / 2, 0); // Adjusting height to start from base
    
        var rightVerticalRod = create_rod(rodRadius, verticalRodHeight, metalMaterial);
        rightVerticalRod.position.set(horizontalRodLength / 3, verticalRodHeight / 2 + 0.05 / 2, 0); // Adjusting height to start from base
    
        // Creating the horizontal rod
        var horizontalRodGeometry = new THREE.CylinderGeometry(rodRadius, rodRadius, horizontalRodLength, 32);
        var horizontalRod = new THREE.Mesh(horizontalRodGeometry, metalMaterial);
        horizontalRod.rotation.z = Math.PI / 2;
        horizontalRod.position.set(0, verticalRodHeight + 0.05 / 2, 0); // Position at the top of vertical rods
    
       
    
        // Adding the components to the holder group
       
        handle.add(leftVerticalRod);
        handle.add(rightVerticalRod);
        handle.add(horizontalRod);
         handle.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2); // Rotate the holder to be vertical
        handle.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2); // Rotate the holder to be vertical
        
        // handle.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2); // Rotate the holder to be vertical
         // Adjust the position as necessary
         handle.scale.set(1/10, 1/10, 1/10);
         
        return handle;
    }

    // Materiais
    var wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
    var doorMaterial = new THREE.MeshPhongMaterial({ map: doorTexture });

    // Espessura das paredes e portas
    var wallThickness = 0.05;
    var doorThickness = 0.02;

    // Dimensões do cacifo
    var lockerWidth = 1;
    var lockerHeight = 2;
    var lockerDepth = 0.5;

    // Criando as paredes do cacifo
    var leftWall = create_wall(wallThickness, lockerHeight, lockerDepth, wallMaterial);
    leftWall.position.set(-lockerWidth / 2 + wallThickness / 2, lockerHeight / 2, 0);

    var rightWall = create_wall(wallThickness, lockerHeight, lockerDepth, wallMaterial);
    rightWall.position.set(lockerWidth / 2 - wallThickness / 2, lockerHeight / 2, 0);

    var topWall = create_wall(lockerWidth, wallThickness, lockerDepth, wallMaterial);
    topWall.position.set(0, lockerHeight - wallThickness / 2, 0);

    var bottomWall = create_wall(lockerWidth, wallThickness, lockerDepth, wallMaterial);
    bottomWall.position.set(0, wallThickness / 2, 0);

    var shoeWall = create_wall(lockerWidth, wallThickness, lockerDepth, wallMaterial);
    shoeWall.position.set(0, wallThickness / 0.2, 0);

    var midWall = create_wall(lockerWidth, wallThickness, lockerDepth, wallMaterial);
    midWall.position.set(0, wallThickness / 0.05, 0);

    var backWall = create_wall(lockerWidth, lockerHeight, wallThickness, wallMaterial);
    backWall.position.set(0, lockerHeight / 2, -lockerDepth / 2 + wallThickness / 2);

    // Criando a porta do cacifo
    var door = create_wall(lockerWidth - wallThickness , lockerHeight, doorThickness, doorMaterial);
    door.position.set(0, lockerHeight / 2, lockerDepth-0.25 );

    // adicionar uma bobradiça à porta
    var hinge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), wallMaterial);
    hinge.position.set(-lockerWidth / 2.1, lockerHeight / 3, lockerDepth / 40);
    door.add(hinge);
    //duplicate hinge 
    var hinge2 = hinge.clone();
    hinge2.position.set(-lockerWidth / 2.1, lockerHeight / 5, lockerDepth / 40);
    door.add(hinge2);


    // infireiores

    var hinge3 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), wallMaterial);
    hinge3.position.set(-lockerWidth / 2.1, - lockerHeight / 3, lockerDepth / 40);
    door.add(hinge3);
    //duplicate hinge 
    var hinge4 = hinge.clone();
    hinge4.position.set(-lockerWidth / 2.1, -lockerHeight / 5, lockerDepth / 40);
    door.add(hinge4);



    

    // Adicionando a maçaneta à porta
    var handle = create_handle();
    handle.position.set(0.35, wallThickness , 0);
    door.add(handle);

    // Adicionando as paredes ao grupo
    locker.add(leftWall);
    locker.add(rightWall);
    locker.add(topWall);
    locker.add(bottomWall);
    locker.add(backWall);
    locker.add(midWall);
    locker.add(shoeWall);
    locker.add(door);

    // Posição do cacifo
    locker.position.set(x, y, z);
    locker.scale.set(8, 12, 8);
    locker.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

    return locker;
}
function create_holder() {
    var holder = new THREE.Group(); // Group to store all parts of the holder
    

    // Textures
    var metalTexture = new THREE.TextureLoader().load('./Objetos/Textures/lamp/brushed_metal 2.jpg'); // Assuming the texture for metal

    // Function to create a cylindrical rod
    function create_rod(radius, height, material) {
        var geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
        return new THREE.Mesh(geometry, material);
    }

    // Materials
    var metalMaterial = new THREE.MeshPhongMaterial({ map: metalTexture });

    // Dimensions
    var rodRadius = 0.05;
    var verticalRodHeight = 1.5;
    var horizontalRodLength = 1.2;

    // Creating the base
    var baseGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
    var baseMaterial = new THREE.MeshPhongMaterial({ map: metalTexture });
    var base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0.025 / 2, 0); // Position at the bottom
    

    // Creating the vertical rods
    var leftVerticalRod = create_rod(rodRadius, verticalRodHeight, metalMaterial);
    leftVerticalRod.position.set(-horizontalRodLength / 2, verticalRodHeight / 2 + 0.05 / 2, 0); // Adjusting height to start from base

    var rightVerticalRod = create_rod(rodRadius, verticalRodHeight, metalMaterial);
    rightVerticalRod.position.set(horizontalRodLength / 2, verticalRodHeight / 2 + 0.05 / 2, 0); // Adjusting height to start from base

    // Creating the horizontal rod
    var horizontalRodGeometry = new THREE.CylinderGeometry(rodRadius, rodRadius, horizontalRodLength, 32);
    var horizontalRod = new THREE.Mesh(horizontalRodGeometry, metalMaterial);
    horizontalRod.rotation.z = Math.PI / 2;
    horizontalRod.position.set(0, verticalRodHeight + 0.05 / 2, 0); // Position at the top of vertical rods

   

    // Adding the components to the holder group
    holder.add(base);
    holder.add(leftVerticalRod);
    holder.add(rightVerticalRod);
    holder.add(horizontalRod);
    holder.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2); // Rotate the holder to be vertical
    holder.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2); // Rotate the holder to be vertical
    
    holder.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2); // Rotate the holder to be vertical
     // Adjust the position as necessary
     holder.scale.set(3, 2, 3);
    return holder;
}
    
    const OrthographicSphere = create_camera_sphere();
    scene.add(OrthographicSphere);
    scene.OrthographicSphere = OrthographicSphere; // Add this line
    return scene;
}

function create_camera_sphere() {
    var textura = new THREE.TextureLoader().load('./Objetos/textures/SmileyFace.png');
    // Create a material with the texture
    var materialTextura = new THREE.MeshBasicMaterial({ map: textura });
    // Add the cube to your scene
    var geometry = new THREE.SphereGeometry(5, 32, 32);
    return new THREE.Mesh(geometry, materialTextura);
}