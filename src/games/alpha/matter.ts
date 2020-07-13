import * as e from 'entropi'
import { Engine, World, Body, Vector, Bounds } from 'matter-js'

export class MatterPhysics implements e.Physics {
    engine: Engine;
    
    constructor() {
        this.engine = Engine.create()
        this.engine.world.gravity.y = 0;
    }
    update(delta: number): void { 
        Engine.update(this.engine, delta)
    }
    
    add(body: e.Body): void { 
        let b = body as MatterBody
        World.addBody(this.engine.world, b.body)
    }
    
    remove(body: e.Body): void {
        let b = body as MatterBody
        World.remove(this.engine.world, b.body)
    }
}

export class MatterBody implements e.Body {
    
    constructor(public body: Matter.Body, public interactionBody: Matter.Body = null) {
        this.body = body
        this.interactionBody = interactionBody
    }
    
    pos(): e.Vector {
        return {
            x: this.body.position.x, 
            y: this.body.position.y
        }
    }
    
    angle(): number {
        return this.body.angle
    }

}

export namespace MatterControllers {

    export function boundary(bound: Bounds): e.Controller {
        let func = (entity: any, bound: Bounds) => {
            let b = entity.body as MatterBody
            if (b.body.position.x > bound.max.x) {
                Body.setPosition(b.body, Vector.create(bound.max.x, b.body.position.y))
                Body.setVelocity(b.body, Vector.create())
            }
            if (b.body.position.x < bound.min.x) {
                Body.setPosition(b.body, Vector.create(bound.min.x, b.body.position.y))
                Body.setVelocity(b.body, Vector.create())
            }
            if (b.body.position.y > bound.max.y) {
                Body.setPosition(b.body, Vector.create(b.body.position.x, bound.max.y))
                Body.setVelocity(b.body, Vector.create())
            }
            if (b.body.position.y < bound.min.y) {
                Body.setPosition(b.body, Vector.create(b.body.position.x, bound.min.y))
                Body.setVelocity(b.body, Vector.create())
            }
        }
        return e.Controllers.generic(bound, func)
    }

}