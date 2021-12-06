import './style.css'
import * as THREE from 'three'
import * as lil from 'lil-gui'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

/**
 * Debug UI
 */

const gui = new lil.GUI()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load('textures/gradients/3.jpg')

/**
 * Base
 */
 const canvas = document.querySelector('.webgl')

//scene
const scene = new THREE.Scene()

//scroll
window.addEventListener('scroll', () => {
    let scrollY = window.scrollY
})

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
 * objects
 */
gradient.magFilter = THREE.NearestFilter
const material = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: gradient })
const objectsDistance = 6

const mesh1 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(1, .4, 16, 60),
    material
)
mesh1.position.x = 3

const mesh2 = new THREE.Mesh(
    new THREE.ConeBufferGeometry(1, 2, 32),
    material
)

mesh2.position.set(-3, -objectsDistance, 0)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh3.position.set(3, -objectsDistance * 2, 0)

const sectionMeshes = [mesh1, mesh2, mesh3]
scene.add(mesh1, mesh2, mesh3)

gui.addColor(material, 'color')

//particles
const particlesCount = 200
const particleGeometry = new THREE.BufferGeometry()
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++) {
    const i3 = i * 3
    positions[i3    ] = (Math.random() - .5) * 15
    positions[i3 + 1] = objectsDistance * .5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i3 + 2] = Math.random() * -5
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    size: .03
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, 0)
scene.add(directionalLight)

/**
 * Gsap
 */
gsap.to(mesh1.rotation, {
    scrollTrigger: {
        trigger: '.hero',
        scrub: .2,
    },
    y: '+=6.28',
    ease: 'power2.inOut'
})

gsap.to(mesh2.rotation, {
    scrollTrigger: {
        trigger: '.right',
        start: "top 75%",
        end: "top 25%",
        scrub: .2,
    },
    x: '+=3.5',
    ease: 'power2.inOut'
})

window.addEventListener("load", function() {
    gsap.to(mesh3.rotation, {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: .2,
        },
        y: '+=4',
        ease: 'power2.inOut'
    })
})

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
camera.position.z = 5
scene.add(camera)

const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//clock
const clock = new THREE.Clock()
let previousTime = 0

//animations
const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //objects
    for(const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * .1
        mesh.rotation.y += deltaTime * .12
    }

    //camera
    camera.position.y = -scrollY / sizes.height * objectsDistance
    
    const parallaxX = cursor.x
    const parallaxY = cursor.y
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()