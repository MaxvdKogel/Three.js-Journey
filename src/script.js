import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

//scene
const scene = new THREE.Scene()

//objects
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2

group.add(cube1, cube2, cube3)

//sizes
const sizes = {
    width: 800,
    height: 600
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

//renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//clock
const clock = new THREE.Clock()

//animations
const tl = gsap.timeline({
    repeat: -1,
    defaults: {
        duration: 1.5
    }
})

tl.to(cube2.position, {
    x: 2
}).to(cube3.position, {
    x: -2
}, "-=1.5").to(cube2.position, {
    x: -2
}).to(cube3.position, {
    x: 2
}, "-=1.5")


const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()

    //update objects
    cube1.position.y = Math.sin(elapsedTime * 2) * 1.5
    cube1.position.x = Math.cos(elapsedTime * 2) * 1.5

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()