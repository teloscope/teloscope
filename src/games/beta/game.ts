
// Imports
import { Vector } from 'matter-js';
import { PaperScope, Path, Color, Point, Size, Rectangle, Layer, PointText, Group } from 'paper';
import { Puzzle, Block, Direction } from './puzzle';
import Clock from './assets/time.svg';
import Scale from './assets/scale.svg';
import Star from './assets/star.svg';
import { Settings } from './settings'

// Variables
let paper = new PaperScope()
let puzzles: Puzzle[] = [];
let examplePuzzle: Puzzle;
let currentPuzzle: Puzzle = null;
let gameRunning: boolean = true;
let estimatedTimePractice: number = 0;
const panelSize = new Size(500, 500)
const panelPos = new Point((Settings.screen.width - panelSize.width)/2, 80)
const averageTimePerPuzzle = Settings.completionTime / 6;


// Layers
let explanationLayer: any;
let testLayer: any;
let estimationLayer: any;
let dashboardLayer: any;
let durationLayer: any;
let puzzleLayer: any

let dashboardPuzzles: any

window.onload = () => {

    paper.install(window)
    let paperCanvas = <HTMLCanvasElement> document.getElementById('gameCanvas')
    paperCanvas.width = Settings.screen.width;
    paperCanvas.height = Settings.screen.height;
    paper.setup(paperCanvas)

    // explanationLayer = new Layer({
    //     name: 'explanation',
    //     visible: false,
    // })
    // buildExplanationLayer()

    // testLayer = new Layer({
    //     name: 'test',
    //     visible: false,
    // })

    // buildTestLayer()

    // estimationLayer = new Layer({
    //     name: 'estimation',
    //     visible: false
    // })

    // buildEstimationLayer()

    durationLayer = new Layer({
        name: 'duration',
        visible: false,
    })
    buildDurationLayer()

    puzzleLayer = new Layer({
        name: 'puzzle',
        visible: false,
    })
    buildPuzzleLayer()

    designPuzzles()
    dashboardLayer = new Layer({
        name: 'dashboard',
        visible: false,
    })
    buildDashboard()
    

    dashboardLayer.visible = true;
    setTime()

//    buildTestEnvironment()
}

// TODO: Design the rest of the puzzles
function designPuzzles() {
    // examplePuzzle = new Puzzle({
    //     position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
    //     maxUnbalance: 20,
    //     scoreSlope: -3,
    //     baseTime: averageTimePerPuzzle,
    // })
    // examplePuzzle.addBlock(Direction.Horizontal, 1, Vector.create(0,4), true)

    // examplePuzzle.addBlock(Direction.Horizontal, 1, Vector.create(1,5))
    // examplePuzzle.addBlock(Direction.Horizontal, 1, Vector.create(2,5))

    // examplePuzzle.addBlock(Direction.Vertical, 1, Vector.create(3, 2))
    // examplePuzzle.addBlock(Direction.Vertical, 2, Vector.create(2, 3))

    // examplePuzzle.addPuzzleRules()


    let puzzle = new Puzzle({
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 2,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    puzzles.push(puzzle)
    puzzle.addBlock(Direction.Horizontal, 1, Vector.create(0,4), true)

    puzzle.addBlock(Direction.Horizontal, 1, Vector.create(1,5))
    puzzle.addBlock(Direction.Horizontal, 1, Vector.create(2,5))
    puzzle.addBlock(Direction.Horizontal, 1, Vector.create(4,5))
    puzzle.addBlock(Direction.Horizontal, 3, Vector.create(0,2))
    puzzle.addBlock(Direction.Horizontal, 1, Vector.create(4,1))
    puzzle.addBlock(Direction.Horizontal, 1, Vector.create(5,1))

    puzzle.addBlock(Direction.Vertical, 1, Vector.create(3, 2))
    puzzle.addBlock(Direction.Vertical, 2, Vector.create(2, 3))
    puzzle.addBlock(Direction.Vertical, 2, Vector.create(5, 2))
    puzzle.addBlock(Direction.Vertical, 2, Vector.create(6, 3))

    puzzle.addPuzzleRules()
    // puzzle.setInitialOccupanyGrid()

    let secondPuzzle = new Puzzle({
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 3,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    secondPuzzle.addBlock(Direction.Horizontal, 1, Vector.create(0,4), true)

    secondPuzzle.addBlock(Direction.Horizontal, 1, Vector.create(5,1))
    secondPuzzle.addBlock(Direction.Horizontal, 1, Vector.create(4,1))

    secondPuzzle.addBlock(Direction.Vertical, 3, Vector.create(2,3))
    secondPuzzle.addBlock(Direction.Vertical, 3, Vector.create(3,2))
    secondPuzzle.addBlock(Direction.Vertical, 3, Vector.create(4,2))

    secondPuzzle.addPuzzleRules()
    puzzles.push(secondPuzzle)

    let thirdPuzzle = new Puzzle({
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 2,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    thirdPuzzle.addBlock(Direction.Horizontal, 1, Vector.create(0,4), true)

    thirdPuzzle.addBlock(Direction.Horizontal, 1, Vector.create(5,2))
    thirdPuzzle.addBlock(Direction.Horizontal, 1, Vector.create(6,1))

    thirdPuzzle.addBlock(Direction.Vertical, 1, Vector.create(2,4))
    thirdPuzzle.addBlock(Direction.Vertical, 2, Vector.create(3,3))
    thirdPuzzle.addBlock(Direction.Vertical, 1, Vector.create(4,2))
    thirdPuzzle.addBlock(Direction.Vertical, 2, Vector.create(5,3))
    thirdPuzzle.addBlock(Direction.Vertical, 3, Vector.create(1,2))

    thirdPuzzle.addPuzzleRules()
    puzzles.push(thirdPuzzle)

    let fourthPuzzle = new Puzzle({
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 4,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    fourthPuzzle.addBlock(Direction.Vertical, 3, Vector.create(3,1))
    fourthPuzzle.addPuzzleRules()
    puzzles.push(fourthPuzzle)
    let fifthPuzzle = new Puzzle({
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 4,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    fifthPuzzle.addBlock(Direction.Vertical, 3, Vector.create(3,1))
    fifthPuzzle.addPuzzleRules()
    puzzles.push(fifthPuzzle)
    let sixthPuzzle = new Puzzle({
        position: new Point((Settings.screen.width - (7*70) + 10)/2, panelPos.y + 10 ),
        maxUnbalance: 4,
        scoreSlope: -3,
        baseTime: averageTimePerPuzzle,
    })
    sixthPuzzle.addBlock(Direction.Vertical, 3, Vector.create(3,1))
    sixthPuzzle.addPuzzleRules()
    puzzles.push(sixthPuzzle)
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
        if (currentPuzzle != null) {
            if (currentPuzzle.running && currentPuzzle.timeRemaining !== null) {
                puzzleClockText.content = toTimeString(currentPuzzle.timeRemaining)
                if (currentPuzzle.timeRemaining === 10) { 
                    puzzleClockText.fillColor = Settings.color.warning;
                }
            }
            if (currentPuzzle.timeRemaining === 0) {
                currentPuzzle.timedOut = true;
                updateDashboard()
                dashboardLayer.visible = true;
                puzzleClockText.content = ""
                puzzleLayer.visible = false;
            }
            if (currentPuzzle.completed) {
                if(currentPuzzle === examplePuzzle){
                    estimationLayer.visible = true
                    puzzleLayer.visible = false
                    examplePuzzle.completed = false
                }
                else {
                    currentPuzzle.puzzleCompletedText.visible = true
                    updateDashboard()
                    dashboardLayer.visible = true;
                    currentPuzzle.pause()
                    puzzleClockText.content = ""
                    puzzleLayer.visible = false;
                }
            }
            else {
                currentPuzzle.puzzleCompletedText.visible = false
            }
        }
    }, 1000)

    setInterval(() => {
        if (currentPuzzle !== null) {
            if (currentPuzzle.currentBalance.x < 0) {
                puzzleBalanceLeft.content = (-1 * currentPuzzle.currentBalance.x).toString()
                leftBarPath.visible = true;
                if (currentPuzzle.currentBalance.x === - currentPuzzle.maxUnbalance) {
                    puzzleBalanceLeft.fillColor = Settings.color.warning
                    leftBarPath.fillColor = Settings.color.warning;
                } else {
                    puzzleBalanceLeft.fillColor = Settings.color.symbol
                    leftBarPath.fillColor = Settings.color.background;
                }
                puzzleBalanceRight.content = ""
                rightBarPath.visible = false;
            } else if (currentPuzzle.currentBalance.x > 0) {
                puzzleBalanceLeft.content = ""
                leftBarPath.visible = false;
                puzzleBalanceRight.content = currentPuzzle.currentBalance.x.toString()
                rightBarPath.visible = true;
                if (currentPuzzle.currentBalance.x === currentPuzzle.maxUnbalance) {
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
    
            if (currentPuzzle.currentBalance.y > 0) {
                puzzleBalanceTop.content = currentPuzzle.currentBalance.y.toString()
                topBarPath.visible = true;
                puzzleBalanceBottom.content = "";
                bottomBarPath.visible = false;
                if (currentPuzzle.currentBalance.y === currentPuzzle.maxUnbalance) {
                    puzzleBalanceTop.fillColor = Settings.color.warning;
                    topBarPath.fillColor = Settings.color.warning;
                } else {
                    puzzleBalanceTop.fillColor = Settings.color.symbol;
                    topBarPath.fillColor = Settings.color.background;
                }
            } else if (currentPuzzle.currentBalance.y < 0) { 
                puzzleBalanceTop.content = "";
                topBarPath.visible = false;
                puzzleBalanceBottom.content = (-1 * currentPuzzle.currentBalance.y).toString()
                bottomBarPath.visible = true;
                if (currentPuzzle.currentBalance.y === -currentPuzzle.maxUnbalance) {
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
            puzzleMaxUnbalanced.content = currentPuzzle.maxUnbalance.toString()
    
            if (currentPuzzle.maxUnbalance < Math.abs(currentPuzzle.currentBalance.x) || currentPuzzle.maxUnbalance < Math.abs(currentPuzzle.currentBalance.y)){
                currentPuzzle.restart()
                currentPuzzle.calculateBalance()
                    
            }
        }
    }, 100)


    createReturn()

    
    let panel = new Rectangle(panelPos, panelSize)
    let path = new Path.Rectangle(panel, new Size(10, 10))
    path.fillColor = Settings.color.background
}

function buildExplanationLayer(){
    let title = new PointText({
        position: [Settings.screen.width/2, 50],
        content: "Game Overview",
        fontSize: 30,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    let rules = new PointText({
        position: [50, 150],
        content: "The game has blocks which can either move in the horizontal direction or the vertical direction",
        fontSize: 16,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    let win = new PointText({
        position: [50, 200],
        content: "The goal of the game is to get the red block from one side of the screen to the other",
        fontSize: 16,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    let ready = new PointText({
        position: [50, 300],
        content: "Click here when you are ready",
        fontSize: 16,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    ready.onClick = function(event: any) {
        explanationLayer.visible = false;
        buildTestEnvironment()
    }

}

function buildTestLayer(){
    let title = new PointText({
        position: [screen.width/2, 50],
        content: "Game Overview",
        fontSize: 30,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    let rules = new PointText({
        position: [50, 150],
        content: "There is 6 games and you have 5 minutes to complete as many as possible, before each game you have to predict how long it will take you",
        fontSize: 16,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    let win = new PointText({
        position: [50, 200],
        content: "the quicker you complete a game the more points as well as the quicker you predict you can complete it and do so the more points ",
        fontSize: 16,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    let ready = new PointText({
        position: [50, 400],
        content: "Click here to start",
        fontSize: 16,
        strokeColor: new Color(0.4, 0.4, 0.4, 1),
    })

    ready.onClick = function(event: any) {
        examplePuzzle.completed = false;
        testLayer.visible = false;
        dashboardLayer.visible = true;
        examplePuzzle.completed = false
        
        setTime()
    }

}

function buildTestEnvironment(){
    loadPuzzle(examplePuzzle)
    puzzleLayer.visible = true
    puzzleLayer.children[10].visible = false;
}


function buildDashboard() {

    new PointText({
        position: [Settings.screen.width/2 - 35, 60],
        content: "Puzzles",
        fontSize: 24,
    })

    dashboardPuzzles = new Group()


    const rows = 2;
    const columns = 3;
    const rectSize = new Size(200, 200);
    const spacing = 30;
    const rectRadius = new Size(10, 10)
    let rectOffset = new Point((Settings.screen.width - (columns * rectSize.width + (columns - 1) * spacing)) / 2,
    (Settings.screen.height - (rows * rectSize.height + (rows - 1) * spacing))/2)
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let puzzleIcon = new Group()
            let idx = y * columns + x
            let rectangle = new Rectangle(new Point(rectOffset.x + (x * (rectSize.width + spacing)),
            rectOffset.y + (y * (rectSize.height + spacing))), rectSize)
            let path = new Path.Rectangle(rectangle, rectRadius)
            path.fillColor = Settings.color.background
            path.name = "panel" + idx
            let graphic = puzzles[idx].graphic.clone()
            graphic.scale(0.3)
            graphic.visible = true;
            graphic.position = new Point(path.position.x, path.position.y - 10)
            
            const tippingPoint = new PointText({
                point: [rectangle.bottomLeft.x + 60, rectangle.bottomLeft.y - 15],
                content: puzzles[idx].maxUnbalance.toString(),
                fontSize: 16,
                fillColor: new Color('black'),
            })
            const baseScore = new PointText({
                point: [rectangle.bottomLeft.x + 160, rectangle.bottomLeft.y - 15],
                content: "30",
                fontSize: 16,
                fillColor: new Color('black'),
            })
            puzzleIcon.addChild(path)
            puzzleIcon.addChild(tippingPoint)
            puzzleIcon.addChild(graphic)
            puzzleIcon.addChild(baseScore)
            puzzleIcon.importSVG(Scale, {
                onLoad: function(item: any) {
                    item.scale(0.05);
                    item.position = new Point(rectangle.bottomLeft.x + 40, rectangle.bottomLeft.y - 20)
                    item.fillColor = Settings.color.symbol
                }
            });
            puzzleIcon.importSVG(Star, {
                onLoad: function(item: any) {
                    item.scale(0.05);
                    item.position = new Point(rectangle.bottomLeft.x + 140, rectangle.bottomLeft.y - 20)
                    item.fillColor = Settings.color.symbol
                }
            });
            puzzleIcon.onClick = () => {
                loadPuzzle(puzzles[idx])
                if (currentPuzzle.estimatedCompletionTime === null) {
                    durationLayer.visible = true;
                } else {
                    puzzleLayer.visible = true
                }
                dashboardLayer.visible = false;
                console.log("pressed puzzle " + (idx))
            }
            console.log(puzzleIcon)
            dashboardPuzzles.addChild(puzzleIcon)
        }
    }
}

function updateDashboard() {
    for (let idx = 0; idx < dashboardPuzzles.children.length; idx++) {
        if (puzzles[idx].timedOut) {
            console.log("we have a timeout")
            dashboardPuzzles.children[idx].fillColor = new Color('red')
            dashboardPuzzles.children[idx].onClick = () => { return }
        }
        else if (puzzles[idx].completed) {
            console.log("The game has been completed")
            dashboardPuzzles.children[idx].fillColor = new Color('green')
            let finishTime = new PointText({
                point: [dashboardPuzzles.children[idx].children[0].position.x - 30, dashboardPuzzles.children[idx].children[0].position.y + 10],
                content: toTimeString(puzzles[idx].estimatedCompletionTime - puzzles[idx].timeRemaining),
                fontSize: 32,
                fillColor: new Color('white')
            })
            console.log(dashboardPuzzles.children[idx].children[0])
            dashboardPuzzles.children[idx].addChild(finishTime)
            dashboardPuzzles.children[idx].onClick = () => { return }
            
        }
    }
}

function buildEstimationLayer() {
    let question = new PointText({
        point: [80, 200],
        content: "How long do you think it took you to finish that task?",
        fontSize: 24,
    })

    const estimatedTime = {
        lower: 0,
        upper: 100,
        current: 50,
        step: 10,
    }

    const rectSize = new Size (600, 20)
    let rectangle = new Rectangle(new Point((Settings.screen.width - rectSize.width)/2, 300), rectSize)
    let path = new Path.Rectangle(rectangle, new Size(rectSize.height/2, rectSize.height/2))
    path.fillColor = Settings.color.background

    let timeText = new PointText({
        point: [rectangle.center.x - 40, rectangle.center.y + 50],
        content: estimatedTime.current + " seconds",
        fontSize: 16,
    })

    let dummyCircle = new Path.Circle(new Point(Settings.screen.width/2, 310), 20)
    dummyCircle.fillColor = new Color('red')
    dummyCircle.onMouseDrag = (event: any) => {
        let x = event.point.x;
        if (x > rectangle.bottomRight.x) {
            dummyCircle.position.x = rectangle.bottomRight.x
        } else if ( x < rectangle.bottomLeft.x) {
            dummyCircle.position.x = rectangle.bottomLeft.x
        } else {
            dummyCircle.position.x = event.point.x;
        }
        estimatedTime.current = Math.round(((dummyCircle.position.x - rectangle.bottomLeft.x)/ rectangle.width)
        * (estimatedTime.upper - estimatedTime.lower))
        timeText.content = estimatedTime.current + " seconds"
    }

    let startText2 = new PointText({
        point: [Settings.screen.width/2 - 80, 450],
        content: "Start Challenge",
        fontSize: 24,
    })
    startText2.onClick = () => {
        console.log("You thought it took you  " + estimatedTime.current + " seconds to complete the practice game.")
        examplePuzzle.estimatedCompletionTime = estimatedTime.current
        testLayer.visible = true;
        estimationLayer.visible = false;
    }
}

function buildDurationLayer() {
    let question = new PointText({
        point: [80, 200],
        content: "How long do you believe you will take to finish this challenge?",
        fontSize: 24,
    })

    const estimatedTime = {
        lower: 0,
        upper: 100,
        current: 50,
        step: 5,
    }

    const rectSize = new Size (600, 20)
    let rectangle = new Rectangle(new Point((Settings.screen.width - rectSize.width)/2, 300), rectSize)
    let path = new Path.Rectangle(rectangle, new Size(rectSize.height/2, rectSize.height/2))
    path.fillColor = Settings.color.background

    let timeText = new PointText({
        point: [rectangle.center.x - 40, rectangle.center.y + 50],
        content: estimatedTime.current + " seconds",
        fontSize: 16,
    })

    let dummyCircle = new Path.Circle(new Point(Settings.screen.width/2, 310), 20)
    dummyCircle.fillColor = new Color('red')
    dummyCircle.onMouseDrag = (event: any) => {
        let x = event.point.x;
        if (x > rectangle.bottomRight.x) {
            dummyCircle.position.x = rectangle.bottomRight.x
        } else if ( x < rectangle.bottomLeft.x) {
            dummyCircle.position.x = rectangle.bottomLeft.x
        } else {
            let adjStep = (rectSize.width * estimatedTime.step) / (estimatedTime.upper - estimatedTime.lower)
            console.log(adjStep)
            dummyCircle.position.x = rectangle.bottomLeft.x + Math.round((event.point.x - rectangle.bottomLeft.x) / adjStep) * adjStep;
        }
        estimatedTime.current = Math.round(((dummyCircle.position.x - rectangle.bottomLeft.x)/ rectangle.width)
        * (estimatedTime.upper - estimatedTime.lower))
        timeText.content = estimatedTime.current + " seconds"
    }

    let startText = new PointText({
        point: [Settings.screen.width/2 - 80, 450],
        content: "Start Challenge",
        fontSize: 24,
    })
    startText.onClick = () => {
        console.log("Let the games begin. You have " + estimatedTime.current + " seconds to complete.")
        currentPuzzle.setCompletionTime(estimatedTime.current)
        puzzleLayer.visible = true;
        currentPuzzle.start();
        gameRunning = true;
        durationLayer.visible = false;
    }

    createReturn()

}

function updateDuration() {
    
}

function createReturn() {
    let iconPos = new Point(5, 5)
    let dashboardIcon = new Path.Rectangle(iconPos, new Size(135,35))
    dashboardIcon.fillColor = new Color('white')
    let iconGroup = new Group([dashboardIcon])
    for (let i = 0; i < 3; i++) {
        let rect = new Path.Rectangle(new Point(iconPos.x + 5, iconPos.y + (i * 8) + 5), new Size(22, 3))
        rect.fillColor = new Color(0.5, 0.5, 0.5, 1)
        iconGroup.addChild(rect)
    }
    const menuText = new PointText({
        point: [50, 25],
        content: "Back",
        fontSize: 16,
        // fillColor: color.symbol,
    })
    iconGroup.addChild(menuText)
    iconGroup.onClick = () => {
        console.log("Let's go home")
        updateDashboard()
        dashboardLayer.visible = true;
        gameRunning = true;
        durationLayer.visible = false;
        puzzleLayer.visible = false;
    }
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
        content: toTimeString(Settings.completionTime),
        fontSize: 16,
        color: new Color(0.4, 0.4, 0.4, 1)
    })
    setInterval(() => {
        if (gameRunning) {
            Settings.completionTime--;
            clockText.content = toTimeString(Settings.completionTime)
            if (Settings.completionTime == 10) { 
                clockText.fillColor = Settings.color.warning;
            }
            if (Settings.completionTime == 0) {
                window.location.href = "/end";
            }
        }
    }, 1000)
}

function loadPuzzle(puzzle: Puzzle) {
    console.log("Loading puzzle: " + puzzle)
    if (currentPuzzle !== null) {
        currentPuzzle.graphic.visible = false;
    }
    currentPuzzle = puzzle;
    currentPuzzle.graphic.visible = true;
}

function toTimeString(time: number): string {
    if (time <= 0) { return "0:00" }
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    if (seconds === 0) { return minutes + ":00" }
    if (seconds < 10) { return minutes + ":0" + seconds}
    return minutes + ":" + seconds
}

function wait(ms: number){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}
