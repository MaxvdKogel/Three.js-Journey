import * as THREE from 'three'
import Experience from '../Experience'

export default class Environment {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setSunLight()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(0xffffff, 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = .05
        this.sunLight.position.set(3, 3, -2.25)
        this.scene.add(this.sunLight)
    }
}