import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lil from 'lil-gui'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Debug UI
 */

const gui = new lil.GUI()
const debugObject = {
    survey: false
}

debugObject.createSphere = () => {
    createSphere(Math.random() * .5, {
        x: (Math.random() - .5) * 3,
        y: 3,
        z: (Math.random() - .5) * 3
    })
}
gui.add(debugObject, 'createSphere')

debugObject.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - .5) * 3,
        y: 3,
        z: (Math.random() - .5) * 3
    })
}
gui.add(debugObject, 'createBox')

debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        //remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        //remove mesh
        scene.remove(object.mesh)
    }
}
gui.add(debugObject, 'reset')


/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    const strength = collision.contact.getImpactVelocityAlongNormal()
    if(strength > 1.5) {
        function clamp(val, min, max) {
            return val > max ? max : val < min ? min : val;
        }
        hitSound.volume = clamp((Math.random() * strength) / 10, 0, 1)
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
 const canvas = document.querySelector('.webgl')

//scene
const scene = new THREE.Scene()

//cursor 
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - .5
    cursor.y = -(event.clientY / sizes.height - .5)
})

/**
 * Physics world
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: .1,
    restitution: .7
})
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: new CANNON.Plane()
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * .5
)
world.addBody(floorBody)

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

//duck
// gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf',
// (duck) => {
//     duck.scene.children[0].rotation.y = -Math.PI * .5
//     duck.scene.children[0].position.set(2, -.1, 0)
//     scene.add(duck.scene.children[0])
// })

//flight helmet
// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf',
// (flightHelmet) => {
//     scene.add(flightHelmet.scene)
// },
// (progress) => {
//     console.log('loading')
// },
// (error) => {
//     console.log('error')
// })

// Fox
let mixer,
    surveyAction,
    walkAction,
    runAction

gltfLoader.load('/models/Fox/glTF/Fox.gltf',
(fox) => {
    mixer = new THREE.AnimationMixer(fox.scene)
    surveyAction = mixer.clipAction(fox.animations[0])
    walkAction = mixer.clipAction(fox.animations[1])
    runAction = mixer.clipAction(fox.animations[2])
    surveyGUI(surveyAction)
    walkGUI(walkAction)
    runGUI(runAction)
    scene.add(fox.scene)
    fox.scene.scale.set(0.025, 0.025, 0.025)
})

//GUI animations
const animations = gui.addFolder('animations')

let survey, walk, run = false

const surveyGUI = (animation) => {
    debugObject.survey = () => {
        if(survey == true) {
            animation.stop()
            survey = false
        } else {
            animation.play()
            survey = true
        }
    }
    animations.add(debugObject, 'survey')
}

const walkGUI = (animation) => {
    debugObject.walk = () => {
        if(walk == true) {
            animation.stop()
            walk = false
        } else {
            animation.play()
            walk = true
        }
    }
    animations.add(debugObject, 'walk')
}

const runGUI = (animation) => {
    debugObject.run = () => {
        if(run == true) {
            animation.stop()
            run = false
        } else {
            animation.play()
            run = true
        }
    }
    animations.add(debugObject, 'run')
}

/**
 * objects
 */

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: 'grey',
        side: THREE.DoubleSide,
    })
)
plane.receiveShadow = true
plane.rotation.x = Math.PI * .5

scene.add(plane)

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)

const ambientLight = new THREE.AmbientLight(0xffffff, .6)
scene.add(directionalLight, ambientLight)

/**
 * sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2.5, 7.5)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

//controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//Utils
const objectsToUpdate = []

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
const createSphere = (radius, position) => {
    //create sphere
    const mesh = new THREE.Mesh(sphereGeometry, material)
    mesh.castShadow = true
    mesh.position.copy(position)
    mesh.scale.set(radius, radius, radius)
    scene.add(mesh)

    //create sphere in physics world
    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(radius)
    })
    body.position.copy(mesh.position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    //save the mesh and body
    objectsToUpdate.push({
        mesh,
        body
    })
}

const boxGeometry = new THREE.BoxBufferGeometry(1,1,1)
const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, material)
    mesh.position.copy(position)
    mesh.scale.set(width, height, depth)
    scene.add(mesh)

    //physics world
    const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(width * .5, height * .5, depth * .5))
    })
    body.position.copy(mesh.position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    //save in array
    objectsToUpdate.push({
        mesh,
        body
    })
}

//clock
const clock = new THREE.Clock()
let previousTime = 0

//animations
const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //physics
    for(const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    world.step(1/60, deltaTime, 3)

    //mixer
    if(mixer) {
        mixer.update(deltaTime)
    }

    //camera
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()