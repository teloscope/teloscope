import { Entity, Vector } from 'entropi';
import { Path, Point, Color, Group } from 'paper'
import { Block } from './physics'
import { config } from './config'

export function createUnit(form: string, pos: Vector, abs: Vector): Entity {
    const canvasPos = toPoint(abs)
    let sprite: any = null;
    switch (form) {
        case "black_player":
            sprite = new Path.Circle(canvasPos, 20);
            sprite.fillColor = new Color('black');
            break; 
            
        case "wall":
            sprite = new Path.Rectangle(canvasPos, config.unitSize)
            sprite.fillColor = config.color.black
            break;
            
        case "green_gate":
            sprite = new Path.Rectangle(canvasPos, config.unitSize)
            sprite.fillColor = config.color.green;
            break;

        case "symbol_control":
            sprite = createControlSprite(canvasPos)
            break;

        case "symbol_you":
            sprite = createYouSprite(canvasPos)
            break; 

        case "symbol_move":
            sprite = createMoveSprite(canvasPos)
            break;
            
        case "symbol_black_player":
            sprite = createPlayerSymbol(canvasPos, config.color.black)
            break;
            
        case "symbol_green_gate":
            sprite = createGateSymbol(canvasPos, config.color.green)
            break;
            
        case "symbol_red_player":
            sprite = createPlayerSymbol(canvasPos, config.color.red)
            break;
            
        case "red_player":
            sprite = new Path.Circle(canvasPos, 20)
            sprite.fillColor = config.color.red
            break;
            
        case "yellow_gate":
            sprite = new Path.Rectangle(canvasPos, config.unitSize)
            sprite.fillColor = config.color.yellow;
            break;
            
        case "symbol_yellow_gate":
            sprite = createGateSymbol(canvasPos, config.color.yellow)
            break;
            
        case "red_gate":
            sprite = new Path.Rectangle(canvasPos, config.unitSize)
            sprite.fillColor = config.color.red;
            break;
            
        case "symbol_red_gate":
            sprite = createGateSymbol(canvasPos, config.color.red)
            break;
            
        case "blue_player": 
            sprite = new Path.Circle(canvasPos, 20)
            sprite.fillColor = config.color.blue
            break;
        
        case "symbol_blue_player":
            sprite = createPlayerSymbol(canvasPos, config.color.blue)
            break;
        
            
        case "symbol_win":
            sprite = createWinSprite(canvasPos)
            break;
            
        default:
            return null
    }
    
    return new Entity({
        name: form,
        usingBody: new Block(form, pos.x, pos.y),
        fromSprite: sprite,
    })

}

function toPoint(v: Vector) {
    return new paper.Point(v.x, v.y)
}

export function createControlSprite(canvasPos: paper.Point): paper.Group {
    let controlSprite = new Group()
    let outerSquare = new Path.Rectangle(canvasPos.add(1), config.unitSize.subtract(2))
    let rotatedSquare = new Path.Rectangle(outerSquare.position.subtract(new Point(config.unitSize.divide(4))), config.unitSize.divide(2))
    rotatedSquare.rotation = 45;
    rotatedSquare.fillColor = config.color.black;
    let firstLine = new Path.Line(outerSquare.position.subtract(new Point(config.unitSize.divide(2))).add(1), outerSquare.position.add(new Point(config.unitSize.divide(2))).subtract(1))
    let secondLine = firstLine.clone()
    secondLine.rotation = 90;
    controlSprite.addChildren([firstLine, secondLine, rotatedSquare, outerSquare])
    controlSprite.strokeWidth = 2;
    controlSprite.strokeColor = config.color.black;
    return controlSprite
}

export function createYouSprite(canvasPos: paper.Point): paper.Group {
    let youSprite = new Group()
    let center = canvasPos.add(new Point(config.unitSize.divide(2)))
    let outerSquare = new Path.Rectangle(canvasPos.add(1), config.unitSize.subtract(2))
    let outerCircle = new Path.Circle(center, (config.unitSize.width / 3))
    let innerCircle = new Path.Circle(center, config.unitSize.width / 8)
    innerCircle.fillColor = config.color.black;
    youSprite.addChildren([outerSquare, outerCircle, innerCircle])
    youSprite.strokeWidth = 2;
    youSprite.strokeColor = config.color.black;
    return youSprite
}

function createMoveSprite(canvasPos: paper.Point): paper.Group {
    let x = config.unitSize.width; 
    let moveSprite = new Group()
    let outerSquare = new Path.Rectangle(canvasPos.add(1), config.unitSize.subtract(2))
    let firstLine = new Path.Line(canvasPos.add(new Point(10, x - 10)), canvasPos.add(new Point(x - 10, x - 10)))
    let secondLine = new Path.Line(canvasPos.add(new Point(x/2, 10)), canvasPos.add(new Point(x / 2, x - 10)))
    moveSprite.addChildren([outerSquare, firstLine, secondLine])
    moveSprite.strokeWidth = 2;
    moveSprite.strokeColor = config.color.black;
    return moveSprite
}

function createGateSymbol(canvasPos: paper.Point, color: paper.Color): paper.Group {
    let sprite = new Group()
    let outerSquare = new Path.Rectangle(canvasPos.add(1), config.unitSize.subtract(2))
    let innerSquare = new Path.Rectangle(canvasPos.add(10), config.unitSize.divide(2))
    innerSquare.fillColor = color
    sprite.addChildren([outerSquare, innerSquare])
    outerSquare.strokeWidth = 2;
    outerSquare.strokeColor = config.color.black
    return sprite
}

function createPlayerSymbol(canvasPos: paper.Point, color: paper.Color): paper.Group {
    let sprite = new Group()
    let outerSquare = new Path.Rectangle(canvasPos.add(1), config.unitSize.subtract(2))
    let center = canvasPos.add(new Point(config.unitSize.divide(2)))
    let innerCircle = new Path.Circle(center, config.unitSize.width / 3)
    innerCircle.fillColor = color
    sprite.addChildren([outerSquare, innerCircle])
    outerSquare.strokeWidth = 2;
    outerSquare.strokeColor = config.color.black
    return sprite
}

export function createWinSprite(canvasPos: paper.Point): paper.Group {
    let x = config.unitSize.width; 
    let winSprite = new Group()
    let outerSquare = new Path.Rectangle(canvasPos.add(1), config.unitSize.subtract(2))
    let innerTriangle = new Path.RegularPolygon(canvasPos.add(config.unitSize.divide(2).width), 3, 10)
    innerTriangle.fillColor = config.color.black
    winSprite.addChildren([outerSquare, innerTriangle])
    winSprite.strokeWidth = 2;
    winSprite.strokeColor = config.color.black;
    return winSprite
}