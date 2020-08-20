import { Vector } from 'matter-js';
import { PaperScope, Path, Color, Point, Size, Rectangle, Layer, PointText, Group } from 'paper';
import { Puzzle, Block, Direction } from './puzzle';
import Clock from './assets/time.svg';
import Scale from './assets/scale.svg';
import Star from './assets/star.svg';
import { config } from './config'

// Variables
let paper = new PaperScope()
let exampleTime: number = 0;
let examplePuzzle: Puzzle = null;
let gameRunning: boolean = true;
const panelPos = new Point((config.screen.width - config.panel.width)/2, 80)
const averageTimePerPuzzle = config.completionTime / 6;
let puzzleLayer: any;


window.onload = () => { 

    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('instructionsCanvas')
    paperCanvas.width = config.screen.width;
    paperCanvas.height = config.screen.height;
    paper.setup(paperCanvas)

    puzzleLayer = new Layer({
        name: 'puzzle',
        visible: true,
    })
    
    buildPuzzleLayer()
    
    designPuzzles()
    
    examplePuzzle.graphic.visible = true;
    
    setTime()

}


function designPuzzles() {
    examplePuzzle = new Puzzle({
        gameNumber: 0,
        position: new Point((config.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 5,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    examplePuzzle.addBlock(Direction.Horizontal, 1, Vector.create(0,4), true)

    examplePuzzle.addBlock(Direction.Horizontal, 2, Vector.create(1,2))
    examplePuzzle.addBlock(Direction.Horizontal, 4, Vector.create(1,5))
    examplePuzzle.addBlock(Direction.Horizontal, 3, Vector.create(3,3))

    examplePuzzle.addBlock(Direction.Vertical, 1, Vector.create(3, 0))
    examplePuzzle.addBlock(Direction.Vertical, 2, Vector.create(2, 3))
    examplePuzzle.addBlock(Direction.Vertical, 3, Vector.create(5, 0))
    examplePuzzle.addBlock(Direction.Vertical, 1, Vector.create(4, 4))

    examplePuzzle.addPuzzleRules()
}

function buildPuzzleLayer() {

    let puzzleClockText = new PointText({
        position: [config.screen.width - 160, 25],
        // content:
        fontSize: 16,
    })
    let puzzleBalanceLeft = new PointText({
        position: [100, config.screen.height/2],
        fontSize: 20,
        fillColor: config.color.symbol
    })
    let leftBar = new Rectangle(new Point(125, panelPos.y), new Size(15, config.panel.height))
    let leftBarPath = new Path.Rectangle(leftBar, new Size(5,5))
    leftBarPath.fillColor = config.color.background;
    leftBarPath.visible = false;
    let puzzleBalanceRight = new PointText({
        position: [config.screen.width - 110, config.screen.height/2],
        fontSize: 20,
        fillColor: config.color.symbol
    })
    let rightBar = new Rectangle(new Point(config.screen.width - 140, panelPos.y), new Size(15, config.panel.height))
    let rightBarPath = new Path.Rectangle(rightBar, new Size(5,5))
    rightBarPath.fillColor = config.color.background;
    rightBarPath.visible = false;
    let puzzleBalanceTop = new PointText({
        position: [config.screen.width/2, 30],
        fontSize: 20,
        fillColor: config.color.symbol
    })
    let topBar = new Rectangle(new Point(panelPos.x, panelPos.y - 25), new Size(config.panel.width, 15))
    let topBarPath = new Path.Rectangle(topBar, new Size(5,5))
    topBarPath.fillColor = config.color.background;
    topBarPath.visible = false;
    let puzzleBalanceBottom = new PointText({
        position: [config.screen.width/2, config.screen.height - 10],
        fontSize: 20,
        fillColor: config.color.symbol
    })
    let bottomBar = new Rectangle(new Point(panelPos.x, panelPos.y + config.panel.height + 10), new Size(config.panel.width, 15))
    let bottomBarPath = new Path.Rectangle(bottomBar, new Size(5,5))
    bottomBarPath.fillColor = config.color.background;
    bottomBarPath.visible = false;
    
    puzzleLayer.importSVG(Scale, {
        onLoad: function(item: any) {
            item.scale(0.05);
            item.position = new Point(140, 18);
            item.fillColor = config.color.symbol;
        }
    });
    let puzzleMaxUnbalanced = new PointText({
        position: [165, 25],
        fontSize: 20,
    })

    setInterval(() => {
        if (examplePuzzle != null) {
            if (examplePuzzle.running && examplePuzzle.timeRemaining !== null) {
                puzzleClockText.content = toTimeString(examplePuzzle.timeRemaining)
                if (examplePuzzle.timeRemaining === 10) { 
                    puzzleClockText.fillColor = config.color.warning;
                }
            }
            if (examplePuzzle.timeRemaining === 0) {
                examplePuzzle.timedOut = true;
                puzzleClockText.content = ""
                examplePuzzle.pause()
                // puzzleLayer.visible = false;
            }
            if (examplePuzzle.completed) {
                examplePuzzle.puzzleCompletedText.visible = true
                examplePuzzle.pause()
                puzzleClockText.content = ""
            }
            else {
                examplePuzzle.puzzleCompletedText.visible = false
            }
        }
    }, 1000)

    setInterval(() => {
        if (examplePuzzle !== null) {
            if (examplePuzzle.currentBalance.x < 0) {
                puzzleBalanceLeft.content = (-1 * examplePuzzle.currentBalance.x).toString()
                leftBarPath.visible = true;
                if (examplePuzzle.currentBalance.x === - examplePuzzle.maxUnbalance) {
                    puzzleBalanceLeft.fillColor = config.color.warning
                    leftBarPath.fillColor = config.color.warning;
                } else {
                    puzzleBalanceLeft.fillColor = config.color.symbol
                    leftBarPath.fillColor = config.color.background;
                }
                puzzleBalanceRight.content = ""
                rightBarPath.visible = false;
            } else if (examplePuzzle.currentBalance.x > 0) {
                puzzleBalanceLeft.content = ""
                leftBarPath.visible = false;
                puzzleBalanceRight.content = examplePuzzle.currentBalance.x.toString()
                rightBarPath.visible = true;
                if (examplePuzzle.currentBalance.x === examplePuzzle.maxUnbalance) {
                    puzzleBalanceRight.fillColor = config.color.warning;
                    rightBarPath.fillColor = config.color.warning;
                } else {
                    puzzleBalanceRight.fillColor = config.color.symbol;
                    rightBarPath.fillColor = config.color.background;
                }
            } else {
                puzzleBalanceLeft.content = ""
                puzzleBalanceRight.content = ""
                leftBarPath.visible = false;
                rightBarPath.visible = false;
            }
    
            if (examplePuzzle.currentBalance.y > 0) {
                puzzleBalanceTop.content = examplePuzzle.currentBalance.y.toString()
                topBarPath.visible = true;
                puzzleBalanceBottom.content = "";
                bottomBarPath.visible = false;
                if (examplePuzzle.currentBalance.y === examplePuzzle.maxUnbalance) {
                    puzzleBalanceTop.fillColor = config.color.warning;
                    topBarPath.fillColor = config.color.warning;
                } else {
                    puzzleBalanceTop.fillColor = config.color.symbol;
                    topBarPath.fillColor = config.color.background;
                }
            } else if (examplePuzzle.currentBalance.y < 0) { 
                puzzleBalanceTop.content = "";
                topBarPath.visible = false;
                puzzleBalanceBottom.content = (-1 * examplePuzzle.currentBalance.y).toString()
                bottomBarPath.visible = true;
                if (examplePuzzle.currentBalance.y === -examplePuzzle.maxUnbalance) {
                    puzzleBalanceBottom.fillColor = config.color.warning;
                    bottomBarPath.fillColor = config.color.warning;
                } else {
                    puzzleBalanceBottom.fillColor = config.color.symbol;
                    bottomBarPath.fillColor = config.color.background;
                }
            } else {
                puzzleBalanceTop.content = "";
                topBarPath.visible = false;
                puzzleBalanceBottom.content = "";
                bottomBarPath.visible = false;
            }
            puzzleMaxUnbalanced.content = examplePuzzle.maxUnbalance.toString()
    
            if (examplePuzzle.maxUnbalance < Math.abs(examplePuzzle.currentBalance.x) || examplePuzzle.maxUnbalance < Math.abs(examplePuzzle.currentBalance.y)){
                // examplePuzzle.restart()
                examplePuzzle.calculateBalance()
                    
            }
        }
    }, 100)

    
    let panel = new Rectangle(panelPos, config.panel)
    let path = new Path.Rectangle(panel, new Size(10, 10))
    path.fillColor = config.color.background
}

function toTimeString(time: number): string {
    if (time <= 0) { return "0:00" }
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    if (seconds === 0) { return minutes + ":00" }
    if (seconds < 10) { return minutes + ":0" + seconds}
    return minutes + ":" + seconds
}

function setTime() {
    new Layer({
        name: "time",
    })
    paper.project.importSVG(Clock, {
        onLoad: function(item: any) {
            item.scale(0.4);
            item.position = new Point(config.screen.width - 100, 20)
            item.fillColor = config.color.symbol
        }
    });
    let clockText = new PointText({
        position: [config.screen.width - 80, 25],
        content: toTimeString(exampleTime),
        fontSize: 16,
        color: new Color(0.4, 0.4, 0.4, 1)
    })
    setInterval(() => {
        if (gameRunning) {
            exampleTime++;
            clockText.content = toTimeString(exampleTime)
        }
    }, 1000)
}