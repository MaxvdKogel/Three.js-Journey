import * as THREE from 'three'
import Experience from '../Experience'
import Environment from './Environment'
import Water from './Water'

export default class World {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.environment = new Environment()
        this.water = new Water()
    }

    update() {
        this.water.update()
    }
}