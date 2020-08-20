import { Group, Point, Size, Path } from 'paper'
import { config } from './config'
import { GameData } from './data' 


export class PetriNet {
    nodes: Node[] = []
    graphic: any
    grid: paper.Size
    rules: Rule[] = []
    completedText: any
    tokensCreated: number = 0
    tokensLeft: number = 0
    maxTokensCreated: number
    totalTokens: number = 0
    gameRunning: boolean = false
    gameReset: boolean = true
    completed: boolean = false

    constructor(grid: paper.Size, maxTokensCreated: number, public gameData: GameData){
        this.graphic = new Group()
        this.grid = grid
        this.maxTokensCreated = maxTokensCreated 
        this.gameRunning = false
        this.gameReset = true
        this.tokensLeft = maxTokensCreated
        // we only update the attempts field the rest is filled in by game.ts
        this.gameData = gameData
        
        this.gameData.addRun()

        let height = config.screen.height - config.actionBarHeight

        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                let idx = this.toIndex(x, y)
                this.nodes.push(new Node(new Point(((x + 1) * config.screen.width) / (this.grid.width + 1),((y + 1) * height) / (this.grid.height + 1)), idx))
                this.graphic.addChild(this.nodes[this.nodes.length - 1].graphic)
            }
        }
        
    }
    
    selectInputNodes(indices: number[]): void {
        indices.forEach(nodeIdx => {
            this.nodes[nodeIdx].makeInput()
        })
    }
    
    selectGoalNodes(goalNodes: NodePoint[]): void {
        goalNodes.forEach(goalNode => {
            this.nodes[goalNode.nodeNum].makeRequiredToWin(goalNode.token)
        })
    }
    
    // from an index number finds the position in a grid. (0, 0) is top left
    toGrid(index: number): paper.Point {
        return new Point(index % this.grid.width, index / this.grid.width)
    }
    
    // finds the index position reading from left to right. Starts at 0
    toIndex(x: number, y: number): number {
        return y * this.grid.width + x
    }

    addingTokenRules(){
        this.nodes.forEach(node => {
            node.graphic.onClick = (event: any) => {
                // console.log(this.gameRunning)
                // console.log(this.gameReset)
                if(this.maxTokensCreated > this.tokensCreated && node.isAddable && node.tokenCount < 5){
                    node.addTokenOnClick()
                    this.tokensCreated++
                    this.totalTokens++
                    this.tokensLeft--
                    console.log("added token to: " + node.nodeNum)
                    console.log("tokens left: " + this.tokensLeft)
                }
            }
            node.tokenGraphic.forEach(tokenGraphic => {
                tokenGraphic.onClick = (event: any) => {
                    console.log("deleting Token")
                    node.deleteToken()
                    this.totalTokens --
                }
            })
            
        })
        
    }
    
    applyRules(){
        let tokenMoved: boolean = false
        // save state to the game data
        this.nodes.forEach(node => {
            for (let i = 0; i < node.tokenCount; i++) {
                this.gameData.addToken(node.nodeNum)
            }
        })
        // Go through the list of rules and see which requirements are met and carry out the rule if they are
        this.rules.forEach(rule => {
            console.log(rule)
            let hasInputs = true
            for (let j: number =0; j < rule.input.length;j++){
                for (let k: number=0; k < this.nodes.length;k++){
                    if(rule.input[j].nodeNum == this.nodes[k].nodeNum && this.nodes[k].tokenCount < rule.input[j].token){
                        hasInputs = false
                    }
                }
            }
            // console.log("rule " + i + " inputs: " + hasInputs)
            // check if the conditions are meet for the rule
            if(hasInputs){
                tokenMoved = true
                // Go through and delete the tokens from the input nodes
                for(let j: number=0; j < rule.input.length;j++){
                    for(let h: number = 0; h < this.nodes.length;h++){
                        if(this.nodes[h].nodeNum == rule.input[j].nodeNum){
                            for(let k: number=0; k < rule.input[j].token;k++){
                                this.nodes[h].deleteToken()
                            }
                        }
                    }
                }
                // Go through and add the tokens to the output nodes
                for(let j: number=0; j < rule.output.length;j++){
                    for(let h: number = 0; h < this.nodes.length;h++){
                        if(this.nodes[h].nodeNum == rule.output[j].nodeNum){
                            for(let k: number=0; k < rule.output[j].token;k++){
                                this.nodes[h].addToken()
                            }
                        }
                    }
                }
            }
        })
        this.checkIfWin()
        if (!this.completed) {
            this.gameData.addRun()
        }
        this.updateTokenNumber()
        this.gameRunning = false
        return false
    }

    checkIfWin(){
        let win = true
        for (let i: number=0; i < this.nodes.length; i++){
            if(this.nodes[i].tokenCount < this.nodes[i].requiredToWin){
                win = false
                break
            }
        }
        if(win){
            console.log("you have won!")
            this.completed = true
        }
    }

    updateTokenNumber(){
        this.totalTokens = 0
        for (let i: number=0; i < this.nodes.length; i++){
            this.totalTokens = this.totalTokens + this.nodes[i].tokenCount
        }
    }


    deleteAllTokens(){
        this.nodes.forEach(node => {
            node.deleteAllTokens()
        })
        this.gameData.addAttempt()
        this.tokensCreated = 0
        this.tokensLeft = this.maxTokensCreated
    }

}

export type NodePoint = {
    nodeNum: number,
    token: number,
}

export type Rule = { 
    input: NodePoint[],
    output: NodePoint[],
}

// node defaults as an intermediate node
export class Node {
    graphic: any
    tokenGraphic: any[] = []
    pos: paper.Point
    nodeNum: number
    tokenCount: number = 0
    isAddable: Boolean = false;
    requiredToWin: number = 0;
    tokenPos: paper.Point
    
    constructor(pos: paper.Point, nodeNum: number){
        this.pos = pos
        this.nodeNum = nodeNum
        this.graphic = new Path.Circle(new Point(this.pos.x, this.pos.y), 30)
        this.graphic.fillColor = config.color.intermediateNode       
    }
    
    makeInput(): void {
        this.isAddable = true;
        this.graphic.fillColor = config.color.inputNode
    }
    
    makeRequiredToWin(val: number): void {
        this.requiredToWin = val
        this.graphic.fillColor = config.color.goalNode
    }

    addToken(){
        if(this.tokenCount < 5){
            this.tokenCount ++
            this.getTokenPos()
            let token = new Path.Circle(new Point(this.tokenPos.x,this.tokenPos.y), 5)
            token.fillColor = config.color.token
            this.tokenGraphic.push(token)
            console.log(this.tokenGraphic.length)
        }
    }

    deleteAllTokens(){
        console.log("number of tokens at the start of deleting" + this.tokenCount)
        let startTokenCount:number = this.tokenCount
        for (let i: number=0; i < startTokenCount; i++){
            console.log("i value is" + i)
            this.deleteToken()
        }
    }

    deleteToken(){
        this.tokenCount --
        if(this.tokenGraphic.length > 0){
            this.tokenGraphic.pop().remove()
        }
        console.log(this.tokenGraphic.length)

    }

    addTokenOnClick(){
        if(this.isAddable && this.tokenCount < 5){
            this.tokenCount ++
            this.getTokenPos()
            let token = new Path.Circle(new Point(this.tokenPos.x,this.tokenPos.y), 5)
            token.fillColor = config.color.token
            this.tokenGraphic.push(token)
            this.tokenCount = this.tokenGraphic.length
            console.log(this.tokenGraphic.length)
        }
    }

    getTokenPos(){
        if(this.tokenCount == 1){
            this.tokenPos = new Point(this.pos.x,this.pos.y)
        }
        else if(this.tokenCount == 2){
            this.tokenPos = new Point(this.pos.x-10, this.pos.y-10)
        }
        else if(this.tokenCount == 3){
            this.tokenPos = new Point(this.pos.x+10, this.pos.y+10)
        }
        else if(this.tokenCount == 4){
            this.tokenPos = new Point(this.pos.x-10, this.pos.y+10)
        }
        else if(this.tokenCount == 5){
            this.tokenPos = new Point(this.pos.x+10, this.pos.y-10)
        }
    }

}