import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lil from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Debug UI
 */
const gui = new lil.GUI()
const debugObject = {}

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
const canvas = document.querySelector('.webgl')

//scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * environment Map
 */
const environmentMap = scene.background = scene.environment = cubeTextureLoader
    .setPath('/textures/environmentMaps/0/')
    .load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg'
    ])
environmentMap.encoding = THREE.sRGBEncoding

debugObject.envMapIntensity = 5
const environmentMapFolder = gui.addFolder('environmentMap')
environmentMapFolder.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

/**
 * Models
 */

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf',
(flightHelmet) => {
    flightHelmet.scene.scale.set(5,5,5)
    scene.add(flightHelmet.scene)
    updateAllMaterials()
})

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(.25, 3, -2.5)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 10

const directionalLightFolder = gui.addFolder('directionalLight')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.001)
directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)

scene.add(directionalLight)

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
camera.position.set(0, 3, 5)
scene.add(camera)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3

const toneMappingFolder = gui.addFolder('toneMapping')
toneMappingFolder.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    ReinhardToneMapping: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFILM: THREE.ACESFilmicToneMapping
})
toneMappingFolder.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

// controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(0, 2, 0)
controls.enableDamping = true

//clock
const clock = new THREE.Clock()
let previousTime = 0

//animations
const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //camera
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()