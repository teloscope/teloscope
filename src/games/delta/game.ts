import { Game, Entity, Controller, Vector } from 'entropi';
import { PaperScope, Size, Path, Point, Color, Group, Rectangle } from 'paper'
import { PaperRenderer } from './renderer'
import { GridEngine, Block } from './physics'
import { config } from './config'
import game1 from './game1.json'
import { createUnit } from './creation'

let paper = new PaperScope()
const gridSize = {
    x: config.screen.width / config.unitSize.width, 
    y: config.screen.height / config.unitSize.height,
}
let engine = new GridEngine(gridSize, {x: config.unitSize.width, y: config.unitSize.height})

window.onload = () => {
    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    paperCanvas.width = config.screen.width;
    paperCanvas.height = config.screen.height;
    paper.setup(paperCanvas)
    
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
}

function create(game: Game) {
    game.input.Key.SPACE.style = 1 
    game.add.entities(load(game1))
    engine.setControlling("player")
    // we should by default make all symbols moveable
    engine.setDefaultMoveable(["symbol_control", "symbol_you", "symbol_move", "symbol_player", 
        "symbol_green_gate", "symbol_red_player", "symbol_yellow_gate", "symbol_win"])
    engine.setMoveable("player",["green_gate"])
}

function update(game: Game) {
    engine.input(game.input)
}
function load(setup: any): Entity[] {
    let entities: Entity[] = []
    console.log(setup)
    for (let i = 0; i < setup.length; i++) {
        console.log(setup[i])
        for (let j = 0; j < setup[i].x.length; j++) {
            const pos: Vector = { x: setup[i].x[j] as number, y: setup[i].y[j] as number}
            entities.push(createUnit(setup[i].type as string, pos, engine.absToGrid(pos)))
        }
    }
    console.log(entities)
    return entities
}



