import { PaperScope, Size, Path, Point, Color, Layer, PointText, Group } from 'paper'
import {PetriNet, Rule, NodePoint} from './petri'
import ArrowLeft from './assets/arrow-left.svg'
import ArrowRight from './assets/arrow-right.svg'
import ArrowClockwise from './assets/arrow-clockwise.svg'
import { config } from './config'
import { GameData } from './data'
import puzzle1 from './puzzle1.json'
import puzzle2 from './puzzle2.json'
import puzzle3 from './puzzle3.json'
import axios from 'axios'


let paper = new PaperScope()
let puzzleLayer: any
let gameNumber: number = 0 // this also dictates the starting puzzle 
let gameTime: number = 0 // keep track of how much time has been (accurate to 0.1 seconds)
let gameData = new GameData(gameNumber)
let timeSnapshot: number = 0 // used to measure how long each game is
const petriNetSetups = [puzzle1, puzzle2, puzzle3];
let currentPetriNet: PetriNet;

window.onload = () => {
    paper.install(window)
    const paperCanvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    paperCanvas.width = config.screen.width;
    paperCanvas.height = config.screen.height;
    document.body.style.width = config.screen.width.toString()
    paper.setup(paperCanvas)

    puzzleLayer = new Layer({
        name: 'puzzle',
        visible: true,
    })
    currentPetriNet = loadPuzzle(petriNetSetups[gameNumber])
    currentPetriNet.graphic.visible = true;
    addActionBar(puzzleLayer, currentPetriNet)
}

export function loadPuzzle(setup: any): PetriNet {
    console.log(setup)
    let petriNet = new PetriNet(new Size(setup.grid.width as number, setup.grid.height as number), setup.tokens as number, gameData)
    console.log("Nodes: " + petriNet.nodes.length)
    petriNet.selectInputNodes(setup.inputNodes as number[])
    petriNet.selectGoalNodes(setup.objective as NodePoint[])
    petriNet.rules = setup.rules as Rule[]
    petriNet.addingTokenRules()
    return petriNet
}

export function addActionBar(puzzleLayer: paper.Layer, petriNet: PetriNet): void {

    let actionBar = new Group()
    
    // TODO: add back step
    // puzzleLayer.importSVG(ArrowLeft, {
    //     onLoad: function(item: paper.Item) {
    //         let stepBackward = new Group()
    //         let rectangle = new Path.Rectangle(new Point(200, 20), new Size(60, 60))
    //         rectangle.fillColor = new Color('white')
    //         item.scale(35);
    //         item.fillColor = config.color.symbol
    //         item.position = new Point(230, 35)
    //         let text = new PointText({
    //             position: [218, 70],
    //             fontSize: 12,
    //             content: "Back",
    //             fontFamily: 'Open Sans',
    //             fillColor: config.color.symbol,
    //         })
    //         stepBackward.addChildren([rectangle, item, text])
    //         stepBackward.onClick = (e: any) => {
    //             if (petriNet.graphic.visible) {
    //                 petriNet.gameRunning = true
    //                 petriNet.gameReset = false
    //                 petriNet.applyRules()
    //             }
    //         }
    //         actionBar.addChild(stepBackward)
    //     }
    // });
    
    puzzleLayer.importSVG(ArrowRight, {
        onLoad: function(item: paper.Item) {
            let stepForward = new Group()
            
            let rectangle = new Path.Rectangle(new Point(290, 20), new Size(60, 60))
            rectangle.fillColor = new Color('white')
            item.scale(35);
            item.fillColor = config.color.symbol
            item.position = new Point(320, 35)
            let text = new PointText({
                position: [308, 70],
                fontSize: 12,
                content: "Step",
                fontFamily: 'Open Sans',
                fillColor: config.color.symbol,
            })
            stepForward.addChildren([rectangle, item, text])
            stepForward.onClick = () => {
                if (petriNet.graphic.visible) {
                    petriNet.gameRunning = true
                    petriNet.gameReset = false
                    petriNet.applyRules()
                }
            }
            actionBar.addChild(stepForward)
        }
    });
    
    puzzleLayer.importSVG(ArrowClockwise, {
        onLoad: function(item: paper.Item) {
            let reset = new Group()
            
            let rectangle = new Path.Rectangle(new Point(390, 20), new Size(60, 60))
            rectangle.fillColor = new Color('white')
            item.scale(35);
            item.fillColor = config.color.symbol
            item.position = new Point(424, 35)
            let text = new PointText({
                position: [408, 70],
                fontSize: 12,
                content: "Reset",
                fontFamily: 'Open Sans',
                fillColor: config.color.symbol,
            })
        
            reset.addChildren([rectangle, item, text])            
            reset.onClick = (event: any) => {
                if (petriNet.graphic.visible) {
                    petriNet.deleteAllTokens()
                    // gameResetFlag = true
                    petriNet.gameReset = true
                }
            }
            actionBar.addChild(reset)
        }
    });
    
    // let tokenCounterGraphics = new Group()
    let circle = new Path.Circle(new Point(520, 35), 5)
    circle.fillColor = config.color.symbol
    let tokenText = new PointText({
        position: [512, 70],
        content: "Tokens",
        fontFamily: 'Open Sans',
        fontSize: 12,
        fillColor: config.color.symbol,
    })
    
    let tokenCountText = new PointText({
        position: [536, 45],
        content: petriNet.tokensLeft.toString(),
        fontSize: 28,
        fontFamily: 'Open Sans',
        // strokeWidth: 0.2,
        fillColor: config.color.symbol,
    })
    
    actionBar.addChildren([circle, tokenText, tokenCountText])

    let nextText = new PointText({
        position: [config.screen.width / 2 - 20, config.screen.height / 2 + 10],
        content: "Next",
        fontSize: 20,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
        visible: true,
    })

    nextText.onClick = (event: any) => {
        congratulations.visible = false;
        petriNet.graphic.visible = true;
        actionBar.visible = true;
    }
    
    let mainText = new PointText({
        position: [config.screen.width / 2 - 100, config.screen.height / 2 - 70],
        content: "Congratulations",
        fontSize: 28,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
        visible: true,
    })
    
    let subText = new PointText({
        position: [config.screen.width / 2 - 100, config.screen.height / 2 - 30],
        content: "You solved the puzzle",
        fontSize: 20,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
        visible: true,
    })
    
    let congratulations = new Group([mainText, subText, nextText])
    congratulations.visible = false;

    setInterval(() => {
        tokenCountText.content = petriNet.tokensLeft.toString()  
        gameTime += 0.1 // dependent on the interval of 100ms
        if (petriNet.completed) {
            // fill in game data details
            let data = gameData.export()
            data.totalTime = gameTime - timeSnapshot
            // update time snapshot and game number
            timeSnapshot = gameTime
            gameNumber++;
            actionBar.visible = false
            petriNet.completed = false;
            // send data and then reset
            axios.post(config.dataURL, data)
            gameData = new GameData(gameNumber)
            setTimeout(() => {
                petriNet.deleteAllTokens()
                petriNet.graphic.visible = false;
                if (gameNumber < petriNetSetups.length) {
                    petriNet = loadPuzzle(petriNetSetups[gameNumber])
                    petriNet.graphic.visible = false;
                    congratulations.visible = true;
                } else {
                    window.location.href = config.endURL;
                }
            }, 1000)
        }
    },100)


}