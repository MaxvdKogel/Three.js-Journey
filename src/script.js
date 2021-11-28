import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GeometryUtils, MeshStandardMaterial, Plane, WireframeGeometry } from 'three'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('simpleShadow.jpg')

/**
 * Debug UI
 */

const gui = new lil.GUI()
gui.destroy()

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
 * Lights
 */
//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, .5)
const ambientLightFolder = gui.addFolder('Ambient light')
ambientLightFolder.add(ambientLight, 'intensity', 0, 2)

//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, .5)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.radius = 10
const directionalLightFolder = gui.addFolder('Directional light')
directionalLightFolder.add(directionalLight.shadow, 'radius', 0, 30).name('Shadow radius')

//directional light helper
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightHelper.visible = false
directionalLightFolder.add(directionalLightHelper, 'visible').name('Shadow helper visible')

//spotlight
const spotLight = new THREE.SpotLight(0xffffff, .5)
spotLight.position.set(0,2,2)
spotLight.visible = false

const spotLightFolder = gui.addFolder('Spot light')

spotLight.castShadow = true
spotLight.shadow.mapSize.x = 1024
spotLight.shadow.mapSize.y = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.fov = 30

//spotlight helper
const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightHelper.visible = false
spotLightFolder.add(spotLightHelper, 'visible').name('Shadow helper visible')

scene.add(ambientLight, directionalLight, directionalLightHelper, spotLight, spotLightHelper)

/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial({ metalness: .4, side: THREE.DoubleSide})

//sphere
const sphereGeometry = new THREE.SphereBufferGeometry(.5, 32, 32)
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true

//shadow sphere
const shadowGeometry = new THREE.PlaneBufferGeometry(1,1)
const shadow = new THREE.Mesh(
    shadowGeometry,
    new THREE.MeshStandardMaterial({
        color: 0x000000,
        side: THREE.BackSide,
        transparent: true,
        alphaMap: bakedShadow
    })
)
shadow.rotation.x = Math.PI * .5

//ground
const planeGeometry = new THREE.PlaneBufferGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.rotation.x = Math.PI * 1.5
plane.position.y = -.5
plane.receiveShadow = true

shadow.position.y = plane.position.y + 0.01
scene.add(sphere, shadow, plane)

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
camera.position.z = 5
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
renderer.shadowMap.enabled = false

//clock
const clock = new THREE.Clock()

//animations

const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()

    //update objects
    sphere.position.x = Math.sin(elapsedTime * 2) * 2
    sphere.position.z = Math.cos(elapsedTime * 2) * 2
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    shadow.position.x = sphere.position.x
    shadow.position.z = sphere.position.z
    shadow.material.opacity = ( 1 - sphere.position.y ) * 0.5

    //damping
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()