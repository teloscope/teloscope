import { Renderer, Area } from 'entropi';

export class PaperRenderer implements Renderer {

    constructor(public screen: Area) {
        this.screen = screen
    }

    render(): void { return }

    size(): Area {
        return { 
            width: this.screen.width, 
            height: this.screen.height
        }
    }

    add(sprite: paper.Item): void {
        sprite.applyMatrix = false;
    }

    remove(sprite: paper.Item): void {
        sprite.remove()
    }

    setBackgroundColour(color: number): void { return }

    update(sprite: paper.Item, x: number, y: number, angle: number): void {
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.rotation = angle * 180 / Math.PI;
    }

}