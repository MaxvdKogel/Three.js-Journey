import * as THREE from 'three'
import Experience from './Experience'

export default class Renderer {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setRenderer()
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)

        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.renderer.physicallyCorrectLights = true
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.CineonToneMapping
        this.renderer.toneMappingExposure = 1.75
    }

    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.renderer.render(this.scene, this.camera.camera)
    }
}