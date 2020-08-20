import { Game, Entity, Vector } from 'entropi';
import { PaperScope } from 'paper'
import { PaperRenderer } from './renderer'
import { GridEngine, ENGINE_UPDATE_INTERVAL } from './physics'
import { config } from './config'
import game1 from './game1.json'
import game2 from './game2.json'
import game3 from './game3.json'
import { createUnit } from './creation'
import axios from 'axios'

let paper = new PaperScope()
const gridSize = {
    x: config.screen.width / config.unitSize.width, 
    y: config.screen.height / config.unitSize.height,
}
let engine = new GridEngine(gridSize, {x: config.unitSize.width, y: config.unitSize.height})
let games = [game1, game2, game3]
let currentGame = 0;

window.onload = () => {
    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    paperCanvas.width = config.screen.width;
    paperCanvas.height = config.screen.height;
    document.body.style.width = config.screen.width.toString()
    paper.setup(paperCanvas)

    new Game({
        renderer: new PaperRenderer(screen),
        physics: engine,
        create: create,
        update: update,
        options: [
            Game.withFrameRate(ENGINE_UPDATE_INTERVAL),
            Game.withBackGroundColor(0xeeeeee),
        ]
    })
}

function create(game: Game) {
    game.input.Key.SPACE.style = 1 
    game.add.entities(load(games[currentGame]))
    // we should by default make all symbols moveable
    engine.setDefaultMoveable(["symbol_control", "symbol_you", "symbol_move", "symbol_black_player", 
        "symbol_green_gate", "symbol_red_player", "symbol_yellow_gate", "symbol_win", "symbol_red_gate"])
    engine.updateRules()
}

function update(game: Game) {
    engine.input(game.input)
    if (engine.completed) {
        engine.completed = false; 
        engine.gameData.gameNumber = currentGame
        // send game data to the server
        axios.post(config.server, engine.gameData)
        currentGame++;
        engine.clear()
        game.entities.forEach(entity => {
            game.renderer.remove(entity.sprite)
            game.physics.remove(entity.body)
        })
        if (currentGame === games.length) {
            window.location.href = "/dev/delta/review"
        } else {
            game.create(game)
        }
    }
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



