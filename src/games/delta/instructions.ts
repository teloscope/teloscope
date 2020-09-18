import { Game, Entity, Controller, Vector } from 'entropi';
import { PaperScope, Size, Path, Point, Color, Group, Rectangle } from 'paper'
import { PaperRenderer } from './renderer'
import { GridEngine } from './physics'
import { createUnit, createWinSprite, createYouSprite, createControlSprite } from './creation'
import { config } from './config'
import instructionGame from './instructionGame.json'

let paper = new PaperScope()
let symbol = new PaperScope()
// config.screen.height = 200;
const gridSize = {
    x: config.screen.width / config.unitSize.width, 
    y: config.screen.height / config.unitSize.height,
}
let engine = new GridEngine(gridSize, {x: config.unitSize.width, y: config.unitSize.height})

window.onload = () => {
    paper.install(window)
    let instructionCanvas = <HTMLCanvasElement> document.getElementById('instructionsCanvas')
    instructionCanvas.width = config.screen.width;
    instructionCanvas.height = config.screen.height;
    paper.setup(instructionCanvas)  

    new Game({
        renderer: new PaperRenderer(screen),
        physics: engine,
        create: create,
        update: update,
        options: [
            Game.withFrameRate(30),
            Game.withBackGroundColor(0xeeeeee),
        ]
    })
    
    symbol.install(window)
    let symbolCanvas = <HTMLCanvasElement> document.getElementById('symbolCanvas')
    symbolCanvas.width = config.screen.width;
    symbolCanvas.height = 20 + config.unitSize.height;
    symbol.setup(symbolCanvas)
    symbol.activate()
    createYouSprite(new Point(10, 10))
    createControlSprite(new Point(10 + config.unitSize.width, 10))
    createWinSprite(new Point(10 + (2 * config.unitSize.width), 10))
    
    paper.activate()
}

function create(game: Game) {
    game.input.Key.SPACE.style = 1 
    game.add.entities(load(instructionGame))
    engine.setDefaultMoveable(["symbol_control", "symbol_you", "symbol_move", "symbol_black_player", 
        "symbol_green_gate", "symbol_red_player", "symbol_yellow_gate", "symbol_win", "symbol_red_gate"])
    engine.setControlling("black_player")
    engine.updateRules()
}

function update(game: Game) {
    engine.input(game.input)
    if (engine.completed) {
        engine.clear()
        game.entities.forEach(entity => {
            game.renderer.remove(entity.sprite)
            game.physics.remove(entity.body)
        })
        game.create(game)
    }
    
}

function load(setup: any): Entity[] {
    let entities: Entity[] = []
    console.log(setup)
    for (let i = 0; i < setup.length; i++) {
        console.log(setup[i])
        for (let j = 0; j < setup[i].x.length; j++) {
            const pos: Vector = { x: setup[i].x[j] as number, y: setup[i].y[j] as number}
            entities.push(createUnit(setup[i].type as string, pos , engine.absToGrid(pos)))
        }
    }
    console.log(entities)
    return entities
}