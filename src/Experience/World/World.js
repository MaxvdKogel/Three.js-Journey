import * as THREE from 'three'
import Experience from '../Experience'
import Environment from './Environment'
import Flag from './Flag'

export default class World {
    constructor() {
        //Setup
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.environment = new Environment()
        
        //Wait for resources
        this.resources.on('ready', () => {
            this.flag = new Flag()

            this.time.on('tick', () => {
                this.flag.update()
            })
        })
    }
}