import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/vertex.glsl'
import fragmentShader from '../../shaders/fragment.glsl'

export default class Flag {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // geometry
        const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
        const count = planeGeometry.attributes.position.count
        const randoms = new Float32Array(count)

        for(let i = 0; i < count; i++) {
            randoms[i] = Math.random()
        }
        planeGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

        //material
        this.planeMaterial = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uFrequency: { value: new THREE.Vector2(5, 1.5) },
                uTime: { value: 0 },
                uTexture: { value: this.resources.items.flagTexture }
            }
        })

        if(this.debug.active) {
            this.debug.ui.add(this.planeMaterial.uniforms.uFrequency.value, 'x', 0, 20, 0.01).name('frequencyX')
            this.debug.ui.add(this.planeMaterial.uniforms.uFrequency.value, 'y', 0, 20, 0.01).name('frequencyY')
        }

        //mesh
        const plane = new THREE.Mesh(planeGeometry, this.planeMaterial)
        plane.scale.y = 2/3
        this.scene.add(plane)

    }

    update() {
        this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}