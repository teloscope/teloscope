import { PaperScope, Size, Path, Point, Color, Layer, PointText, Group } from 'paper'
import {PetriNet, Rule, NodePoint} from './petri'
import ArrowLeft from './assets/arrow-left.svg'
import ArrowRight from './assets/arrow-right.svg'
import ArrowClockwise from './assets/arrow-clockwise.svg'
import { Settings } from './settings'
import puzzle1 from './puzzle1.json'
import puzzle2 from './puzzle2.json'
import puzzle3 from './puzzle3.json'

let paper = new PaperScope()
let puzzleLayer: any
let gameResetFlag: boolean = true
let gameNumber: number = 0 // this also dictates the starting puzzle 
let petriNetSetups = [puzzle1, puzzle2, puzzle3];
let currentPetriNet: PetriNet;

window.onload = () => {
    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    paperCanvas.width = Settings.screen.width;
    paperCanvas.height = Settings.screen.height;
    document.body.style.width = Settings.screen.width.toString()
    paper.setup(paperCanvas)

    puzzleLayer = new Layer({
        name: 'puzzle',
        visible: true,
    })
    currentPetriNet = loadPuzzle(petriNetSetups[gameNumber])
    currentPetriNet.graphic.visible = true;
    addActionBar()
    // designPuzzles()
}

function loadPuzzle(setup: any): PetriNet {
    console.log(setup)
    let petriNet = new PetriNet(new Size(setup.grid.width as number, setup.grid.height as number), setup.tokens as number)
    console.log("Nodes: " + petriNet.nodes.length)
    petriNet.selectInputNodes(setup.inputNodes as number[])
    petriNet.selectGoalNodes(setup.objective as NodePoint[])
    petriNet.rules = setup.rules as Rule[]
    petriNet.addingTokenRules()
    return petriNet
}

function addActionBar(): void {

    let actionBar = new Group()
    
    puzzleLayer.importSVG(ArrowLeft, {
        onLoad: function(item: paper.Item) {
            let stepBackward = new Group()
            let rectangle = new Path.Rectangle(new Point(200, 20), new Size(60, 60))
            rectangle.fillColor = new Color('white')
            item.scale(35);
            item.fillColor = Settings.color.symbol
            item.position = new Point(230, 35)
            let text = new PointText({
                position: [218, 70],
                fontSize: 12,
                content: "Back",
                fontFamily: 'Open Sans',
                fillColor: Settings.color.symbol,
            })
            stepBackward.addChildren([rectangle, item, text])
            stepBackward.onClick = (e: any) => {
                if (currentPetriNet.graphic.visible) {
                    currentPetriNet.gameRunning = true
                    currentPetriNet.gameReset = false
                    currentPetriNet.applyRules()
                }
            }
            actionBar.addChild(stepBackward)
        }
    });
    
    puzzleLayer.importSVG(ArrowRight, {
        onLoad: function(item: paper.Item) {
            let stepForward = new Group()
            
            let rectangle = new Path.Rectangle(new Point(290, 20), new Size(60, 60))
            rectangle.fillColor = new Color('white')
            item.scale(35);
            item.fillColor = Settings.color.symbol
            item.position = new Point(320, 35)
            let text = new PointText({
                position: [308, 70],
                fontSize: 12,
                content: "Step",
                fontFamily: 'Open Sans',
                fillColor: Settings.color.symbol,
            })
            stepForward.addChildren([rectangle, item, text])
            stepForward.onClick = (e: any) => {
                if (currentPetriNet.graphic.visible) {
                    currentPetriNet.gameRunning = true
                    currentPetriNet.gameReset = false
                    currentPetriNet.applyRules()
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
            item.fillColor = Settings.color.symbol
            item.position = new Point(424, 35)
            let text = new PointText({
                position: [408, 70],
                fontSize: 12,
                content: "Reset",
                fontFamily: 'Open Sans',
                fillColor: Settings.color.symbol,
            })
        
            reset.addChildren([rectangle, item, text])            
            reset.onClick = (event: any) => {
                if (currentPetriNet.graphic.visible) {
                    currentPetriNet.deleteAllTokens()
                    gameResetFlag = true
                    currentPetriNet.gameReset = true
                }
            }
            actionBar.addChild(reset)
        }
    });
    
    // let tokenCounterGraphics = new Group()
    let circle = new Path.Circle(new Point(520, 35), 5)
    circle.fillColor = Settings.color.symbol
    let tokenText = new PointText({
        position: [512, 70],
        content: "Tokens",
        fontFamily: 'Open Sans',
        fontSize: 12,
        fillColor: Settings.color.symbol,
    })
    
    let tokenCountText = new PointText({
        position: [536, 45],
        content: currentPetriNet.tokensLeft.toString(),
        fontSize: 28,
        fontFamily: 'Open Sans',
        // strokeWidth: 0.2,
        fillColor: Settings.color.symbol,
    })
    
    actionBar.addChildren([circle, tokenText, tokenCountText])

    let nextText = new PointText({
        position: [Settings.screen.width / 2 - 20, Settings.screen.height / 2 + 10],
        content: "Next",
        fontSize: 20,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
        visible: true,
    })

    nextText.onClick = (event: any) => {
        congratulations.visible = false;
        currentPetriNet.graphic.visible = true;
        actionBar.visible = true;
    }
    
    
    
    let mainText = new PointText({
        position: [Settings.screen.width / 2 - 100, Settings.screen.height / 2 - 70],
        content: "Congratulations",
        fontSize: 28,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
        visible: true,
    })
    
    let subText = new PointText({
        position: [Settings.screen.width / 2 - 100, Settings.screen.height / 2 - 30],
        content: "You solved the puzzle",
        fontSize: 20,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
        visible: true,
    })
    
    let congratulations = new Group([mainText, subText, nextText])
    congratulations.visible = false;

    setInterval(() => {
        tokenCountText.content = currentPetriNet.tokensLeft.toString()  
        if (currentPetriNet.completed) {
            gameNumber++;
            actionBar.visible = false
            currentPetriNet.completed = false;
            setTimeout(() => {
                currentPetriNet.deleteAllTokens()
                currentPetriNet.graphic.visible = false;
                if (gameNumber < petriNetSetups.length) {
                    currentPetriNet = loadPuzzle(petriNetSetups[gameNumber])
                    currentPetriNet.graphic.visible = false;
                    congratulations.visible = true;
                } else {
                    window.location.href = "/dev/gamma/review";
                }
            }, 1000)
        }
    },100)


}