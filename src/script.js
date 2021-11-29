import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'
import { DoubleSide } from 'three'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

//door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

//walls
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')


//grass
const grassColorTexture = textureLoader.load('textures/grass/color.jpg')
grassColorTexture.repeat.set(8, 8)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
const grassAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg')
grassNormalTexture.repeat.set(8, 8)
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')
grassRoughnessTexture.repeat.set(8, 8)
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * Debug UI
 */

const gui = new lil.GUI()

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * Base
 */
 const canvas = document.querySelector('.webgl')

//scene
const scene = new THREE.Scene()

/**
 * Fog
 */
scene.fog = new THREE.Fog('#262837', 1, 15)

/**
 * Lights
 */
//ambient
const ambientLight = new THREE.AmbientLight(0xb9d5ff, .12)
const ambientLightFolder = gui.addFolder('ambient light')
ambientLightFolder.add(ambientLight, 'intensity', 0, 2)

//moon
const moonLight = new THREE.DirectionalLight(0xb9d5ff, .12)
const moonFolder = gui.addFolder('Moon')
moonFolder.add(moonLight, 'intensity', 0, 2)
moonLight.position.set(4, 5, -2)
const moonLightHelper = new THREE.DirectionalLightHelper(moonLight)
moonLightHelper.visible = false
moonFolder.add(moonLightHelper, 'visible').name('Helper visible')
moonLight.castShadow = true

scene.add(ambientLight, moonLight, moonLightHelper)

/**
 * Objects
 */
//house
const house = new THREE.Group()
//walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5 ,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.attributes.uv2 = walls.geometry.attributes.uv
walls.position.y = 2.5 / 2
walls.castShadow = true

//roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({ color: 0xfb35f45 })
)
roof.position.y = 2.5 + (1.5 / 2)
roof.rotation.y = Math.PI * .25

//door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.attributes.uv2 = door.geometry.attributes.uv
door.position.y = 1
door.position.z = 2 + 0.01
door.position.set(0, 1, 2 + 0.01)

//doorLight
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
const doorLightFolder = gui.addFolder('door light')
doorLight.position.set(0, 2.5, 2.3)
const doorLightHelper = new THREE.PointLightHelper(doorLight, .1)
doorLightHelper.visible = false
doorLightFolder.add(doorLightHelper, 'visible').name('Helper visible')
doorLight.castShadow = true

//bushes
const bushMaterial = new THREE.MeshStandardMaterial({color: 0x89c854})
const bushGeometry = new THREE.SphereBufferGeometry(.5, 32, 16)

const bush1 = new THREE.Mesh( bushGeometry, bushMaterial )
bush1.position.set(1, 0, 2.3)
bush1.scale.set(1, 1, 1)
bush1.castShadow = true

const bush2 = new THREE.Mesh( bushGeometry, bushMaterial )
bush2.position.set(1.5, 0, 2)
bush2.scale.set(.5, .5, .5)
bush2.castShadow = true

house.add(walls, roof, door, doorLight, doorLightHelper, bush1, bush2)

//graves
const graveGeometry = new THREE.BoxBufferGeometry(.5, .75, .25)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 'grey'
})
for(let i = 0; i < 50; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6
    grave.position.x = Math.sin(angle) * radius
    grave.position.z = Math.cos(angle) * radius
    grave.position.y = .75 * .5
    grave.rotation.z = (Math.random() - .5) * 0.4
    grave.rotation.y = (Math.random() - .5) * 0.4
    scene.add(grave)
    grave.castShadow = true
}

//ground
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.attributes.uv2 = floor.geometry.attributes.uv
floor.rotation.x = Math.PI * 1.5
floor.receiveShadow = true

scene.add(house, floor)

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // In case they drag browser to another screen with another pixel ratio
})

//double click for fullscreen (webkit for safari)
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    
    if(!fullscreenElement) {
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if(canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if(document.exitFullscreen) {
            document.exitFullscreen()
        } else if(document.webkitExitFullScreen) {
            document.webkit.webkitExitFullScreen()
        }
    }
})

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 10)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//clock
const clock = new THREE.Clock()
//animations

const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()

    //damping
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()