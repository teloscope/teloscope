import { Group, Rectangle, Point, Size, Path, Color, PointText } from 'paper'
import { Vector } from 'matter-js';
import { Settings } from './settings';

const defaultGrid = Vector.create(7, 7)
const defaultBaseTime: number = 50
export class Puzzle {
    grid: Vector;
    pos: paper.Point;
    blocks: Block[] = [];
    estimatedCompletionTime: number = null;
    timeRemaining: number = null;
    graphic: paper.Group;
    private occupancyGrid: boolean[][] = [];
    chosenBlock: any = null
    currentBalance: Vector;
    maxUnbalance: number;


    completed: boolean = false;
    timedOut: boolean = false;
    running: boolean = false;
    
    score: number = null;
    scoreSlope: number;
    scoreIntercept: number;
    baseTime: number;
    

    // constructor(public grid: Vector = defaultGrid, public pos: any, public maxUnbalance: number, 
    // public isPractice: boolean = false, public baseTime: number, public scoreSlope: number, public scoreIntercept: number) {
    constructor(po: PuzzleOptions) {
        this.grid = po.grid !== undefined ? po.grid : this.grid = defaultGrid ;
        this.pos = po.position
        this.maxUnbalance = po.maxUnbalance
        this.baseTime = po.baseTime !== undefined ? po.baseTime : this.baseTime = defaultBaseTime
        this.scoreSlope = po.scoreSlope;
        this.scoreIntercept = po.scoreIntercept
        
        this.graphic = new Group()
        for (let x = 0; x < this.grid.x; x++) {
            let column: boolean[] = [];
            for (let y = 0; y < this.grid.y; y++) {
                column.push(false)
            }
            this.occupancyGrid.push(column)
        }
    }

    start() {
        if (this.timeRemaining === null) { return }
        this.running = true
        setInterval(() => {
            if (this.running) {
                if (this.timeRemaining <= 0 ) { this.pause() }
                this.timeRemaining--;
            }
        }, 1000)
    }

    pause() { this.running = false }

    resume() { this.running = true }

    restart() {
        for (let x = 0; x < this.grid.x; x++) {
            for (let y = 0; y < this.grid.y; y++) {
                this.occupancyGrid[x][y] = false
            }
        }
        this.blocks.forEach(block => {
            block.reset()
            if (block.direction === Direction.Horizontal) {
                for (let i = block.gridPos.x; i < block.gridPos.x + block.length; i++) {
                    this.occupancyGrid[i][block.gridPos.y] = true;
                }
            } else {
                for (let i = block.gridPos.y; i < block.gridPos.y + block.length; i++) {
                    this.occupancyGrid[block.gridPos.x][i] = true;
                }
            }
        })
    }

    puzzleCompletedText = new PointText({
        position: [100, 200],
        // content:
        fontSize: 50,
        strokeColor: new Color('red'),
        strokeWidth: 4
    })


    addBlock(direction: Direction, length: number, pos: Vector, isKey = false): void{
        let blockPos = this.gridToAbsolute(pos)
        let newBlock = new Block(direction, length, blockPos, pos, isKey)
        if (newBlock.direction == Direction.Horizontal) {
            for (let i: number = 0; i < newBlock.length; i ++) {
                this.occupancyGrid[pos.x + i][pos.y] = true;
            }
        } else {
            for (let i: number = 0; i < newBlock.length; i ++) {
                this.occupancyGrid[pos.x][pos.y + i] = true;
            }
        }
        this.blocks.push(newBlock);
        this.graphic.addChild(newBlock.graphic)
    }

    setCompletionTime(time: number): void {
        if (this.estimatedCompletionTime == null) {
            this.estimatedCompletionTime = time;
            this.timeRemaining = time;
            this.score = this.calculateScore(time)
        }
    }

    calculateBalance() {
        let xBalance = 0;
        let yBalance = 0;

        for (let i: number = 0; i < this.grid.x; i ++) {
            for (let j: number = 0; j < this.grid.y; j ++){
                if (this.occupancyGrid[i][j]){
                    xBalance += i - Math.round(this.grid.x/2) + 1
                    yBalance += -j + Math.round(this.grid.y/2) - 1
                }
            }
        }
        this.currentBalance = Vector.create(xBalance, yBalance)
        if (xBalance > this.maxUnbalance || yBalance > this.maxUnbalance) {
            this.restart()
        }
    }

    addPuzzleRules() {
        this.calculateBalance()
        this.blocks.forEach(block => {
            block.graphic.onMouseDown = (event: any) => {
                console.log(this.chosenBlock)
                if (this.chosenBlock == null) {
                    this.chosenBlock = block;
                    if (block.direction == Direction.Horizontal) {
                        block.upperBound = block.gridPos.x
                        // console.log(block.upperBound)
                        for (let i = block.gridPos.x + block.length; i < this.grid.x; i++) {
                            if (!this.occupancyGrid[i][block.gridPos.y]) {
                                block.upperBound = i - block.length + 1;
                            } else {
                                break;
                            }
                        }
                        block.lowerBound = block.gridPos.x;
                        // console.log(block.lowerBound)
                        for (let i = block.gridPos.x - 1; i >= 0; i--) {
                            if (!this.occupancyGrid[i][block.gridPos.y]) {
                                block.lowerBound = i;
                            } else {
                                break;
                            }
                        }
                        block.clickedPos = event.point.x
                        block.originalPos = block.graphic.position.x
                        // update occupancy grid
                        for (let i = block.gridPos.x; i < block.gridPos.x + block.length; i++) {
                            this.occupancyGrid[i][block.gridPos.y] = false;
                        }
                    } else {
                        block.upperBound = block.gridPos.y
                        for (let i = block.gridPos.y + block.length; i < this.grid.y; i++) {
                            console.log("checking " + i )
                            if (!this.occupancyGrid[block.gridPos.x][i]) {
                                block.upperBound = i - block.length + 1;
                            } else {
                                break;
                            }
                        }
                        block.lowerBound = block.gridPos.y;
                        for (let i = block.gridPos.y - 1; i >= 0; i--) {
                            if (!this.occupancyGrid[block.gridPos.x][i]) {
                                block.lowerBound = i;
                            } else {
                                break;
                            }
                        }
                        block.clickedPos = event.point.y
                        block.originalPos = block.graphic.position.y
                        for (let i = block.gridPos.y; i < block.gridPos.y + block.length; i++) {
                            this.occupancyGrid[block.gridPos.x][i] = false;
                        }
                    }
                    console.log(block.upperBound)
                    console.log(block.lowerBound)
                }
            }
            block.graphic.onMouseDrag = (event: any) => {
                console.log("Click " + block.graphic.position.x)
                if (block.direction == Direction.Horizontal) {
                    let diff = event.point.x - block.clickedPos;
                    let proposedNewPosition = diff + block.originalPos
                    // console.log(proposedNewPosition)
                    let absLowerBound = block.originalPos - (block.gridPos.x - block.lowerBound) * (Settings.block.size + Settings.block.padding)
                    let absUpperBound = block.originalPos + (block.upperBound - block.gridPos.x) * (Settings.block.size + Settings.block.padding)
                    if ( proposedNewPosition > absLowerBound &&
                    proposedNewPosition < absUpperBound  ) {
                        block.graphic.position.x = proposedNewPosition;
                    }
                } else {
                    let diff = event.point.y - block.clickedPos;
                    let proposedNewPosition = diff + block.originalPos
                    // console.log(proposedNewPosition)
                    let absLowerBound = block.originalPos - (block.gridPos.y - block.lowerBound) * (Settings.block.size + Settings.block.padding)
                    let absUpperBound = block.originalPos + (block.upperBound - block.gridPos.y) * (Settings.block.size + Settings.block.padding)
                    if ( proposedNewPosition > absLowerBound &&
                    proposedNewPosition < absUpperBound  ) {
                        block.graphic.position.y = proposedNewPosition;
                    }
                }
            }
            block.graphic.onMouseUp = () => {
                if (this.chosenBlock == block) {
                    console.log("mouseUp")
                    if (block.direction == Direction.Horizontal) {
                        let diff = block.graphic.position.x - block.originalPos
                        let delta = Math.round(diff / (Settings.block.size + Settings.block.padding))
                        console.log("delta: " + delta)
                        block.gridPos.x += delta
                        block.graphic.position.x = block.originalPos + (delta * (Settings.block.size + Settings.block.padding))
                        for (let i = block.gridPos.x; i < block.gridPos.x + block.length; i++) {
                            this.occupancyGrid[i][block.gridPos.y] = true;
                        }
                    } else {
                        let diff = block.graphic.position.y - block.originalPos
                        let delta = Math.round(diff / (Settings.block.size + Settings.block.padding))
                        console.log("delta: " + delta)
                        block.gridPos.y += delta
                        block.graphic.position.y = block.originalPos + (delta * (Settings.block.size + Settings.block.padding))
                        for (let i = block.gridPos.y; i < block.gridPos.y + block.length; i++) {
                            this.occupancyGrid[block.gridPos.x][i] = true;
                        }
                    }
                    this.calculateBalance()
                    if (block.isGameCompleted()){
                        this.completed = true
                    }
                    this.chosenBlock = null;
                }
            }
        })
        this.graphic.visible = false;
    }

    gridToAbsolute(pos: Vector): any {
        return new Point(this.pos.x + pos.x * (Settings.block.size + Settings.block.padding),
        this.pos.y + pos.y * (Settings.block.size + Settings.block.padding));
    }
    
    calculateScore(time: number): number {
        return this.scoreIntercept + (this.scoreSlope * time)
    }

}

export class Block {
    graphic: any = null;
    initialGraphicPos: any;
    rectangle: any = null;
    upperBound: number;
    lowerBound: number;
    clickedPos: number;
    originalPos: number
    initialGridPos: Vector

    constructor(public direction: Direction, public length: number, pos: any, public gridPos: Vector, public isKey: any) {
        this.gridPos = gridPos
        this.initialGridPos = Vector.clone(gridPos)
        this.direction = direction;
        this.length = length;
        this.rectangle = new Rectangle(pos,
        new Size(Settings.block.size + (direction * (length -1) * (Settings.block.size + Settings.block.padding)),
        Settings.block.size + ((1 - direction) * (length -1) * (Settings.block.size + Settings.block.padding))))
        this.graphic = new Path.Rectangle(this.rectangle, Settings.block.fillet)
        this.initialGraphicPos = this.graphic.position.clone()
        this.isKey = isKey
        if(this.isKey){
            this.graphic.fillColor = Settings.color.keyColour
        }
        else if (this.direction == Direction.Vertical){
            this.graphic.fillColor = Settings.color.verticalColour
        }
        else{
            this.graphic.fillColor = Settings.color.horizontalColour
        }
    }

    resetGraphic(pos: Vector) { 
        if (this.graphic !== null) {
            this.graphic.remove()
        }
        this.rectangle.position = pos
        this.graphic = new Path.Rectangle(this.rectangle, Settings.block.fillet)
    }

    reset(){
        this.gridPos = Vector.create(this.initialGridPos.x,this.initialGridPos.y)
        this.graphic.position = this.initialGraphicPos.clone()
    }

    isGameCompleted(){
        if (this.isKey){
            if((this.direction == Direction.Horizontal && this.gridPos.x) == 6 || (this.direction == Direction.Vertical && this.gridPos.y == 6)){
                return true
            }
        }
        return false
    }

}

export type PuzzleOptions = {
    grid?: Vector,
    position: paper.Point,
    maxUnbalance: number, 
    baseTime: number, 
    scoreSlope: number,
    scoreIntercept?: number, 
}

export enum Direction {
    Vertical,
    Horizontal,
}
