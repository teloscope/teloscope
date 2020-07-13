import { Physics, Input, Vector, Body } from 'entropi';

const DEFAULT_MOVEMENT_TIME = 200 // milliseconds

const ENGINE_UPDATE_INTERVAL = 20 // milliseconds

const STATE_SAVE_INTERVAL = 5

export class GridEngine implements Physics {
    map: Block[][] = [];
    controlling: Block[] = [];
    private defaultMoveable: string[] = [];
    
    private listen: boolean = true;
    private moves: Direction[] = [];
    
    private steps: number = 0;
    
    constructor(public grid: Vector, public blockSize: Vector, public offset: Vector = {x: 0, y: 0}) {
        this.grid = grid
        this.blockSize = blockSize;
        this.offset = offset;
        for (let x = 0; x < this.grid.x; x++) {
            let column: Block[] = [];
            for (let y = 0; y < this.grid.y; y++) {
                column.push(null)
            }
            this.map.push(column)
        }
    }
    
    input(input: Input): void {
        if (this.listen) {
            if (input.Key.UP.state || input.Key.W.state)  { 
                this.push.up()
            } else if (input.Key.DOWN.state || input.Key.S.state) { 
                this.push.down()
            } else if (input.Key.LEFT.state || input.Key.A.state) { 
                this.push.left()
            } else if (input.Key.RIGHT.state || input.Key.D.state) { 
                this.push.right()
            } else if (input.Key.ENTER.state) { // full reset
                this.reset()
            } else if (input.Key.SPACE.state) { // revert to last state
                this.restoreState()
            }
        }
    }
    
    update(delta: number): void {
        
    }
    
    add(body: Body): void {
        this.listen = false;
        let b = body as Block;
        b.absPos = this.gridToAbs({x: b.x, y: b.y})
        this.map[b.x][b.y] = b;
        this.listen = true;
    }
    
    remove(body: Body): void { 
        let b = body as Block; 
        this.map[b.x][b.y] = null;
    }
    
    vacant(movingBlock: Block, pos: Vector, from: Direction): boolean { 
        // check world boundaries first
        if (pos.x < 0 || pos.y < 0 || pos.x >= this.grid.x || pos.y >= this.grid.y) { return false }
        if (this.map[pos.x][pos.y] === null) { return true 
        } else if (this.isMoveable(movingBlock, this.map[pos.x][pos.y])) { 
            if (from === Direction.Up) {
                if (pos.y + 1 < this.grid.y && this.map[pos.x][pos.y + 1] === null) { return true }
            } else if (from === Direction.Down) {
                if (pos.y - 1 >= 0 && this.map[pos.x][pos.y - 1] === null) { return true }
            } else if (from == Direction.Left) {
                if (pos.x + 1 < this.grid.x && this.map[pos.x + 1][pos.y] === null) { return true }
            } else if (from === Direction.Right) {
                if (pos.x - 1 >= 0 && this.map[pos.x - 1][pos.y] === null) { return true }
            }
        }
        return false
    } 
    
    isMoveable(movingBlock: Block, impedingBlock: Block): boolean {
        for (let i = 0; i < movingBlock.moveableBlocks.length; i++) {
            if (impedingBlock.label === movingBlock.moveableBlocks[i]) {
                return true;
            }
        }
        return false
    }
    // TODO: create the update rules
    updateRules(): void { 
        console.log("updating rules")
        // reset abilities of controlling blocks
        this.controlling.forEach(block => {
            block.moveableBlocks = this.defaultMoveable.slice()
        })
        this.controlling = [];
        for (let x = 0; x < this.grid.x; x++) {
            for (let y = 0; y < this.grid.y; y++) {
                if ( this.map[x][y] === null) { continue }
                if (this.map[x][y].label === "symbol_you") {
                    if (this.rightNeighbor(this.map[x][y], "symbol_control")) {
                        if ( x + 2 >= this.grid.x || this.map[x + 2][y] === null) { continue }
                        switch (this.map[x + 2][y].label) {
                            case "symbol_player":
                                this.setControlling("player")
                                break
                            case "symbol_red_player":
                                this.setControlling("red_player")
                            case "symbol_win":
                                setTimeout(() => {
                                    window.location.href="end";
                                }, 300)
                            default:
                                break;
                        }
                    }
                    if (this.bottomNeighbor(this.map[x][y], "symbol_control")) {
                        if ( y + 2 >= this.grid.y || this.map[x][y + 2] === null) { continue }
                        switch (this.map[x][y + 2].label) {
                            case "symbol_player":
                                this.setControlling("player")
                                break
                            case "symbol_red_player":
                                this.setControlling("red_player")
                                this.setMoveable("red_player", this.defaultMoveable.slice())
                                break;
                            case "symbol_win":
                                alert("Congrats you won")
                            default:
                                break;
                        }
                    }
                }
            }
        }
        
        for (let x = 0; x < this.grid.x; x++) {
            for (let y = 0; y < this.grid.y; y++) {
                if ( this.map[x][y] === null) { continue }
                switch (this.map[x][y].label) {
                    case "symbol_player":
                        if (this.rightNeighbor(this.map[x][y], "symbol_move")) {
                            if ( x + 2 >= this.grid.x || this.map[x + 2][y] === null) { continue }
                            switch (this.map[x + 2][y].label) {
                                case "symbol_green_gate":
                                    console.log("Hello")
                                    this.setMoveable("player", ["green_gate"])
                                    break
                                default:
                                    break;
                            }
                        }
                        break
                    case "symbol_red_player":
                        if (this.rightNeighbor(this.map[x][y], "symbol_move")) {
                            if ( x + 2 >= this.grid.x || this.map[x + 2][y] === null) { continue }
                            switch (this.map[x + 2][y].label) {
                                case "symbol_yellow_gate":
                                    console.log("World")
                                    this.setMoveable("red_player", ["yellow_gate"])
                                    console.log(this.getBlocks("red_player"))
                                    break
                                default:
                                    break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    
    rightNeighbor(block: Block, label: string): boolean {
        return block.x < this.grid.x - 1 && this.map[block.x + 1][block.y] !== null && this.map[block.x + 1][block.y].label === label
    }
    
    bottomNeighbor(block: Block, label: string): boolean {
        return block.y < this.grid.y - 1 && this.map[block.x][block.y + 1] !== null && this.map[block.x][block.y + 1].label === label
    }
    
    push = {
        left: (): void => {
            this.move({x: -1, y: 0})
        },
        right: (): void => {
            this.move({x: 1, y: 0})
        },
        up: (): void => {
            this.move({x: 0, y: -1})
        },
        down: (): void => {
            this.move({x: 0, y: 1})
        }
        
    }
    
    move(ref: Vector) {
        this.controlling.forEach(block => {
            let directionFrom = Direction.Right
            if (ref.x === 1) { directionFrom = Direction.Left }
            if (ref.y === 1) { directionFrom = Direction.Up }
            if (ref.y === -1) { directionFrom = Direction.Down }
            if (this.vacant(block, {x: block.x + ref.x, y: block.y + ref.y}, directionFrom)) {
                console.log("setting listen to false")
                this.listen = false;
                const velocity = (this.blockSize.x / DEFAULT_MOVEMENT_TIME ) * ENGINE_UPDATE_INTERVAL
                const neighbor = this.map[block.x + ref.x][block.y + ref.y]
                if (neighbor !== null) { 
                    this.map[neighbor.x][neighbor.y] = null
                    neighbor.x += ref.x;
                    neighbor.y += ref.y;
                    this.map[neighbor.x][neighbor.y] = neighbor
                    let neighborTargetPos = this.gridToAbs({x: neighbor.x, y: neighbor.y})
                    let neighborInterval = setInterval(() => {
                        neighbor.absPos.x += (velocity * ref.x)
                        neighbor.absPos.y += -(velocity * ref.y)
                        if (neighbor.absPos.x === neighborTargetPos.x && neighbor.absPos.y === neighborTargetPos.y) {
                            clearInterval(neighborInterval);
                            this.updateRules()
                        }
                        // only update rules when a block is moved
                        console.log("moving block")
                    }, ENGINE_UPDATE_INTERVAL)
                }
                console.log(block.pos())
                this.map[block.x][block.y] = null
                block.x += ref.x;
                block.y += ref.y;
                this.map[block.x][block.y] = block
                let blockTargetPos = this.gridToAbs({x: block.x, y: block.y})
                console.log(blockTargetPos)
                let blockInterval = setInterval(() => {
                    block.absPos.x += (velocity * ref.x)
                    block.absPos.y += -(velocity * ref.y)
                    console.log(block.pos())
                    if (block.absPos.x === blockTargetPos.x && block.absPos.y === blockTargetPos.y) {
                        console.log("stopping")
                        clearInterval(blockInterval);
                        this.listen = true;
                        this.steps++;
                        if (this.steps % STATE_SAVE_INTERVAL == 0) {
                            this.saveState()
                        }
                        console.log(this.steps)
                    }
                }, ENGINE_UPDATE_INTERVAL)
            }
        })
    }
    
    reset() {
        let blocks = this.getAllBlocks()
        blocks.forEach(block => {
            if (this.map[block.x][block.y] === block)
                this.map[block.x][block.y] = null;
            block.reset();
            block.absPos = this.gridToAbs({x: block.x, y: block.y})
            this.map[block.x][block.y] = block;
        })
        this.updateRules()
        this.steps = 0; 
        // console.log(this.map)
    }
    
    setControlling(label: string): void {
        for (let x = 0; x < this.grid.x; x++) {
            for (let y = 0; y < this.grid.y; y++) {
                if (this.map[x][y] !== null && this.map[x][y].label == label) {
                    this.controlling.push(this.map[x][y])
                } 
            }
        }
        
    }
    
    getAllBlocks() {
        let blocks: Block[] = [];
        for (let x = 0; x < this.grid.x; x++) {
            for (let y = 0; y < this.grid.y; y++) {
                if (this.map[x][y] !== null) { 
                    blocks.push(this.map[x][y])
                }
            }
        }
        return blocks
    }
    
    getBlocks(label: string): Block[] {
        let blocks: Block[] = [];
        for (let x = 0; x < this.grid.x; x++) {
            for (let y = 0; y < this.grid.y; y++) {
                if (this.map[x][y] !== null && this.map[x][y].label === label) { 
                    blocks.push(this.map[x][y])
                }
            }
        }
        return blocks
    }
    
    setMoveable(targetLabel: string, moveableLabels: string[]): void {
        this.controlling.forEach(block => {
            if (block.label === targetLabel)
                block.moveableBlocks.push(...moveableLabels)
        })
    }
    
    setDefaultMoveable(labels: string[]): void {
        this.defaultMoveable = labels
    }
    
    gridToAbs(pos: Vector): Vector {
        return { 
            x: pos.x * this.blockSize.x + this.offset.x + this.blockSize.x/2, 
            y: (-1 * pos.y) * this.blockSize.y + this.offset.y - this.blockSize.y/2,
        }
    }
    
    absToGrid(pos: Vector): Vector {
        return { 
            x: (pos.x - this.offset.x - this.blockSize.x/2) / this.blockSize.x,
            y: ((pos.y - this.offset.y + this.blockSize.y/2) / this.blockSize.y) * -1,
        }
    }
    
    saveState() {
        let blocks = this.getAllBlocks()
        blocks.forEach( block => block.saveState())
    }
    
    
    restoreState() {
        // console.log(this.steps)
        if (this.steps < STATE_SAVE_INTERVAL) {
            this.reset()
            return
        }
        let blocks = this.getAllBlocks()
        console.log("state_length: " + blocks[0].states.length)
        blocks.forEach( block => {
            if (this.map[block.x][block.y] === block)
                this.map[block.x][block.y] = null;
            block.restoreState()
            if (this.steps % STATE_SAVE_INTERVAL === 0) {
                // we just saved state so we should restore one more
                block.restoreState()
            }
            block.absPos = this.gridToAbs({x: block.x, y: block.y})
            this.map[block.x][block.y] = block;
        })
        this.updateRules()
        let stepChange = this.steps % STATE_SAVE_INTERVAL
        if (stepChange === 0) {
            this.steps -= STATE_SAVE_INTERVAL
        } else {
            this.steps -= stepChange
        }
        console.log("reverting to step: " + this.steps)
        this.saveState()
    }

}

export class Block implements Body {
    originalPos: Vector;
    moveableBlocks: string[] = [];
    states: Vector[] = [];

    constructor(public label: string, public x: number, public y: number, public absPos: Vector = {x: 0, y: 0}) {
        this.x = x;
        this.y = y;
        this.absPos = absPos;
        this.label = label;
        this.originalPos = {x: x, y: y}
    }
    
    pos(): Vector { return { x: this.absPos.x, y: this.absPos.y } }
    
    angle(): number { return 0 }
    
    reset(): void { 
        this.x = this.originalPos.x;
        this.y = this.originalPos.y;
    }
    
    clone(): Block {
        return new Block(this.label, this.x, this.y, this.absPos)
    }
    
    saveState() {
        this.states.push({x: this.x, y: this.y})
    }
    
    restoreState() {
        if (this.states.length > 0) {
            let lastState = this.states.pop()
            this.x = lastState.x
            this.y = lastState.y
        } else {
            this.reset()
        }
    }
}

enum Direction {
    Left,
    Right,
    Up, 
    Down
}