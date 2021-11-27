import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'
import { TorusBufferGeometry } from 'three'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const colorTexture = textureLoader.load('color.jpg')
const alphaTexture = textureLoader.load('alpha.jpg')
const heightTexture = textureLoader.load('height.jpg')
const ambientOcclusionTexture = textureLoader.load('ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('metalness.jpg')
const normalTexture = textureLoader.load('normal.jpg')
const roughnessTexture = textureLoader.load('roughness.jpg')
const gradientTexture = textureLoader.load('3.jpg')
const matcapTexture = textureLoader.load('1.png')

const environmentMapTexture = cubeTextureLoader.load([
    '/environmentMaps/px.jpg',
    '/environmentMaps/nx.jpg',
    '/environmentMaps/py.jpg',
    '/environmentMaps/ny.jpg',
    '/environmentMaps/pz.jpg',
    '/environmentMaps/nz.jpg'
])

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

//objects

const material = new THREE.MeshStandardMaterial({
    metalness: .95,
    envMap: environmentMapTexture
})
material.roughness = .05
// const material = new THREE.MeshStandardMaterial({
//     map: colorTexture,
//     side: THREE.DoubleSide,
//     transparent: true,
//     aoMap: ambientOcclusionTexture,
//     displacementMap: heightTexture,
//     displacementScale: .05,
//     metalnessMap: metalnessTexture,
//     roughnessMap: roughnessTexture,
//     normalMap: normalTexture,
//     alphaMap: alphaTexture
// })

gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(material, 'roughness', 0, 1, 0.001)
// gui.add(material, 'aoMapIntensity', 0, 5, 0.001)
// gui.add(material, 'displacementScale', 0, .5)
// gui.add(material.normalScale, 'x', 0, 5).name("normalScaleX")
// gui.add(material.normalScale, 'y', 0, 5).name("normalScaleY")

// const plane = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(1,1,100,100),
//     material
// )
// plane.geometry.attributes.uv2 = plane.geometry.attributes.uv

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5, 64, 32),
    material
)


scene.add(sphere)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

//sizes
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
camera.position.z = 1.5
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

//clock
const clock = new THREE.Clock()

//animations

const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()

    //update objects
    // plane.rotation.y = .1 * elapsedTime

    // plane.rotation.x = .15 * elapsedTime

    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()