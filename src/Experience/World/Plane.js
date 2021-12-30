import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/vertex.glsl'
import fragmentShader from '../../shaders/fragment.glsl'

export default class Plane {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.scene = this.experience.scene

        // geometry
        const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

        //material
        this.planeMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            transparent: true
        })

        //mesh
        const plane = new THREE.Mesh(planeGeometry, this.planeMaterial)
        this.scene.add(plane)

    }
}