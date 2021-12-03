import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'

/**
 * Debug UI
 */

const gui = new lil.GUI()
gui.destroy()

/**
 * Cursor
 */
const cursor = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width * 2 - 1
    cursor.y = -(event.clientY / sizes.height * 2 - 1)
})

window.addEventListener('click', () => {
    if(currentIntersect) {
        switch(currentIntersect.object) {
            case sphere1:
                console.log('sphere1 click')
                break
    
            case sphere2:
                console.log('sphere2 click')
                break
            
            case sphere3:
                console.log('sphere3 click')
                break
        }
    }
})

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

/**
 * objects
 */
const geometry = new THREE.SphereBufferGeometry(.5, 32, 32)

const sphere1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))
sphere1.position.x = -2

const sphere2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))

const sphere3 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))
sphere3.position.x = 2

scene.add(sphere1, sphere2, sphere3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null

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

//clock
const clock = new THREE.Clock()
//animations

const tick = () => {
    //time
    const elapsedTime = clock.getElapsedTime()

    //animate objects
    sphere1.position.y = Math.sin(elapsedTime * .3)
    sphere2.position.y = Math.sin(elapsedTime * .8) * 1.5
    sphere3.position.y = Math.sin(elapsedTime * 1.2) * 1.5

    //raycaster
    raycaster.setFromCamera(cursor, camera)

    const spheres = [sphere1, sphere2, sphere3]
    const intersects = raycaster.intersectObjects(spheres)

    for(const sphere of spheres) {
        sphere.material.color.set('#ff0000')
    }

    for(const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    if(intersects.length) {
        if(!currentIntersect) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    }
    else
    {
        if(currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    //damping
    controls.update()

    //render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()