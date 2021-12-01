import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')

/**
 * Base
 */
 const canvas = document.querySelector('.webgl')

//scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters =  {
    count: 100000,
    size: .01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomnessPower: 3,
    colorInside: 0xff6030,
    colorOutside: 0x1b3984
}

let geometry = null
let material = null
let particle = null

const generateGalaxy = () => {

    if(particle !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(particle)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const colorInside = new THREE.Color(parameters.colorInside)
    const colorOutside = new THREE.Color(parameters.colorOutside)

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        //position
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        
        // const randomX = (Math.random() - .5) * parameters.randomness * radius
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius, + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        //color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    particle = new THREE.Points(geometry, material)
    scene.add(particle)
}

generateGalaxy()

gui.add(parameters, 'count', 100, 100000, 100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size', .001, .1, .0001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius', 1, 10, .01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches', 3, 10, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin', 0, 5, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower', 0, 10).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'colorInside').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'colorOutside').onFinishChange(generateGalaxy)

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
camera.position.set(3, 3, 5)
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

    //animation
    particle.rotation.y = elapsedTime * .1
    particle.rotation.z = elapsedTime * .01

    //damping
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()