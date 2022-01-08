import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Experience from './Experience'

export default class Camera {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setCamera()
        this.setOrbitControls()
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(35, this.experience.sizes.width / this.experience.sizes.height, 0.1, 100)
        this.camera.position.set(-3, 2, 3)
        this.scene.add(this.camera)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}