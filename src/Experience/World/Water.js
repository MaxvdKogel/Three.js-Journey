import * as THREE from 'three'
import Experience from '../Experience'
import vertexShader from '../../shaders/water/vertex.glsl'
import fragmentShader from '../../shaders/water/fragment.glsl'

export default class Plane {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.time = this.experience.time

        this.debugObject = {}

        // geometry
        this.waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 512, 512)

        //Color
        this.debugObject.depthColor = '#186691'
        this.debugObject.surfaceColor = '#9bd8ff'

        //material
        this.waterMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },

                //position
                uBigWavesElevation: { value: 0.2 },
                uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                uBigWavesSpeed: { value: .75 },

                //perlin noise
                uSmallWavesElevation: { value: 0.15 },
                uSmallWavesFrequency: { value: 3 },
                uSmallWavesSpeed: { value: 0.2 },
                uSmallWavesItterations: { value: 4.0 },

                //color
                uDepth: { value: new THREE.Color(this.debugObject.depthColor) },
                uSurface: { value: new THREE.Color(this.debugObject.surfaceColor) },
                uOffset: { value: .08 },
                uMultiplier: { value: 5 }
            }
        })

        //mesh
        this.water = new THREE.Mesh(this.waterGeometry, this.waterMaterial)

        //transform
        this.water.rotation.x = Math.PI * .5

        //debug
        if(this.debug.active) {
            const waterFolder = this.debug.ui.addFolder('Water')
            waterFolder.add(this.waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('Elevation')
            waterFolder.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('FrequencyY')
            waterFolder.add(this.waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('FrequencyX')
            waterFolder.add(this.waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(2).step(0.001).name('Speed')
        
            const perlinNoiseFolder = this.debug.ui.addFolder('Perlin noise')
            perlinNoiseFolder.add(this.waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).name('Elevation')
            perlinNoiseFolder.add(this.waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).name('Frequency')
            perlinNoiseFolder.add(this.waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).name('Speed')
            perlinNoiseFolder.add(this.waterMaterial.uniforms.uSmallWavesItterations, 'value').min(0).max(10).step(1).name('Itterations')

            const waterColorFolder = this.debug.ui.addFolder('Water color')
            waterColorFolder.addColor(this.debugObject, 'depthColor').onChange(() => {
                this.waterMaterial.uniforms.uDepth.value.set(this.debugObject.depthColor)
            })
            waterColorFolder.addColor(this.debugObject, 'surfaceColor').onChange(() => {
                this.waterMaterial.uniforms.uSurface.value.set(this.debugObject.surfaceColor)
            })
            waterColorFolder.add(this.waterMaterial.uniforms.uOffset, 'value').min(0).max(1).step(0.001).name('offset')
            waterColorFolder.add(this.waterMaterial.uniforms.uMultiplier, 'value').min(0).max(10).step(0.001).name('multiplier')
        }

        //add to scene
        this.scene.add(this.water)

    }

    update() {
        this.waterMaterial.uniforms.uTime.value = this.time.elapsed
    }
}