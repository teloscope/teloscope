import { Vector } from 'matter-js';
import { PaperScope, Path, Color, Point, Size, Rectangle, Layer, PointText, Group } from 'paper';
import { Puzzle, Block, Direction } from './puzzle';
import Clock from './assets/time.svg';
import Scale from './assets/scale.svg';
import Star from './assets/star.svg';
import { Settings } from './settings'

// Variables
let paper = new PaperScope()
let exampleTime: number = 0;
let examplePuzzle: Puzzle = null;
let gameRunning: boolean = true;
const panelSize = new Size(500, 500)
const panelPos = new Point((Settings.screen.width - panelSize.width)/2, 80)
const averageTimePerPuzzle = Settings.completionTime / 6;
let puzzleLayer: any;


window.onload = () => { 

    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('instructionsCanvas')
    paperCanvas.width = Settings.screen.width;
    paperCanvas.height = Settings.screen.height;
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
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
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
        position: [Settings.screen.width - 160, 25],
        // content:
        fontSize: 16,
    })
    let puzzleBalanceLeft = new PointText({
        position: [100, Settings.screen.height/2],
        fontSize: 20,
        fillColor: Settings.color.symbol
    })
    let leftBar = new Rectangle(new Point(125, panelPos.y), new Size(15, panelSize.height))
    let leftBarPath = new Path.Rectangle(leftBar, new Size(5,5))
    leftBarPath.fillColor = Settings.color.background;
    leftBarPath.visible = false;
    let puzzleBalanceRight = new PointText({
        position: [Settings.screen.width - 110, Settings.screen.height/2],
        fontSize: 20,
        fillColor: Settings.color.symbol
    })
    let rightBar = new Rectangle(new Point(Settings.screen.width - 140, panelPos.y), new Size(15, panelSize.height))
    let rightBarPath = new Path.Rectangle(rightBar, new Size(5,5))
    rightBarPath.fillColor = Settings.color.background;
    rightBarPath.visible = false;
    let puzzleBalanceTop = new PointText({
        position: [Settings.screen.width/2, 30],
        fontSize: 20,
        fillColor: Settings.color.symbol
    })
    let topBar = new Rectangle(new Point(panelPos.x, panelPos.y - 25), new Size(panelSize.width, 15))
    let topBarPath = new Path.Rectangle(topBar, new Size(5,5))
    topBarPath.fillColor = Settings.color.background;
    topBarPath.visible = false;
    let puzzleBalanceBottom = new PointText({
        position: [Settings.screen.width/2, Settings.screen.height - 10],
        fontSize: 20,
        fillColor: Settings.color.symbol
    })
    let bottomBar = new Rectangle(new Point(panelPos.x, panelPos.y + panelSize.height + 10), new Size(panelSize.width, 15))
    let bottomBarPath = new Path.Rectangle(bottomBar, new Size(5,5))
    bottomBarPath.fillColor = Settings.color.background;
    bottomBarPath.visible = false;
    
    puzzleLayer.importSVG(Scale, {
        onLoad: function(item: any) {
            item.scale(0.05);
            item.position = new Point(140, 18);
            item.fillColor = Settings.color.symbol;
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
                    puzzleClockText.fillColor = Settings.color.warning;
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
                    puzzleBalanceLeft.fillColor = Settings.color.warning
                    leftBarPath.fillColor = Settings.color.warning;
                } else {
                    puzzleBalanceLeft.fillColor = Settings.color.symbol
                    leftBarPath.fillColor = Settings.color.background;
                }
                puzzleBalanceRight.content = ""
                rightBarPath.visible = false;
            } else if (examplePuzzle.currentBalance.x > 0) {
                puzzleBalanceLeft.content = ""
                leftBarPath.visible = false;
                puzzleBalanceRight.content = examplePuzzle.currentBalance.x.toString()
                rightBarPath.visible = true;
                if (examplePuzzle.currentBalance.x === examplePuzzle.maxUnbalance) {
                    puzzleBalanceRight.fillColor = Settings.color.warning;
                    rightBarPath.fillColor = Settings.color.warning;
                } else {
                    puzzleBalanceRight.fillColor = Settings.color.symbol;
                    rightBarPath.fillColor = Settings.color.background;
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
                    puzzleBalanceTop.fillColor = Settings.color.warning;
                    topBarPath.fillColor = Settings.color.warning;
                } else {
                    puzzleBalanceTop.fillColor = Settings.color.symbol;
                    topBarPath.fillColor = Settings.color.background;
                }
            } else if (examplePuzzle.currentBalance.y < 0) { 
                puzzleBalanceTop.content = "";
                topBarPath.visible = false;
                puzzleBalanceBottom.content = (-1 * examplePuzzle.currentBalance.y).toString()
                bottomBarPath.visible = true;
                if (examplePuzzle.currentBalance.y === -examplePuzzle.maxUnbalance) {
                    puzzleBalanceBottom.fillColor = Settings.color.warning;
                    bottomBarPath.fillColor = Settings.color.warning;
                } else {
                    puzzleBalanceBottom.fillColor = Settings.color.symbol;
                    bottomBarPath.fillColor = Settings.color.background;
                }
            } else {
                puzzleBalanceTop.content = "";
                topBarPath.visible = false;
                puzzleBalanceBottom.content = "";
                bottomBarPath.visible = false;
            }
            puzzleMaxUnbalanced.content = examplePuzzle.maxUnbalance.toString()
    
            if (examplePuzzle.maxUnbalance < Math.abs(examplePuzzle.currentBalance.x) || examplePuzzle.maxUnbalance < Math.abs(examplePuzzle.currentBalance.y)){
                examplePuzzle.restart()
                examplePuzzle.calculateBalance()
                    
            }
        }
    }, 100)

    
    let panel = new Rectangle(panelPos, panelSize)
    let path = new Path.Rectangle(panel, new Size(10, 10))
    path.fillColor = Settings.color.background
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
            item.position = new Point(Settings.screen.width - 100, 20)
            item.fillColor = Settings.color.symbol
        }
    });
    let clockText = new PointText({
        position: [Settings.screen.width - 80, 25],
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