import { PaperScope, Layer } from 'paper'
import {PetriNet} from './petri'
import { config } from './config'
import { addActionBar, loadPuzzle } from './game'
import instructionsPuzzle from './instructions.json'

let paper = new PaperScope()
let puzzleLayer: any
let currentPetriNet: PetriNet;

window.onload = () => {
    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('instructionsCanvas')
    paperCanvas.width = config.screen.width;
    paperCanvas.height = config.screen.height - 200;
    document.body.style.width = config.screen.width.toString()
    paper.setup(paperCanvas)

    puzzleLayer = new Layer({
        name: 'puzzle',
        visible: true,
    })
    currentPetriNet = loadPuzzle(instructionsPuzzle)
    currentPetriNet.graphic.visible = true;
    addActionBar(puzzleLayer, currentPetriNet)
}