import { PaperScope, Size, Path, Point, Color, Layer, PointText, Group } from 'paper'
import {PetriNet, Rule, NodePoint} from './petri'
import ArrowLeft from './assets/arrow-left.svg'
import ArrowRight from './assets/arrow-right.svg'
import ArrowClockwise from './assets/arrow-clockwise.svg'
import { Settings } from './settings'
import { addActionBar, loadPuzzle } from './game'
import instructionsPuzzle from './instructions.json'

let paper = new PaperScope()
let puzzleLayer: any
let currentPetriNet: PetriNet;

window.onload = () => {
    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('instructionsCanvas')
    paperCanvas.width = Settings.screen.width;
    paperCanvas.height = Settings.screen.height - 200;
    document.body.style.width = Settings.screen.width.toString()
    paper.setup(paperCanvas)

    puzzleLayer = new Layer({
        name: 'puzzle',
        visible: true,
    })
    currentPetriNet = loadPuzzle(instructionsPuzzle)
    currentPetriNet.graphic.visible = true;
    addActionBar(puzzleLayer, currentPetriNet)
}