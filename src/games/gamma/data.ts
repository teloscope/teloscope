// This file outlines the data captured per game in gamma

export class GameData {
    gameNumber: number
    runs: GameRun[] // first index is the attempt number and second index is the initial configuration
    step: number
    
    constructor(gameNumber: number) {
        this.gameNumber = gameNumber;
        this.runs = [];
        this.step = 0;
    }
    
    addRun(): void {
        this.step++;
        this.runs.push({state: [], step: this.step})
    }
    
    addAttempt(): void {
        this.step = 0
        this.addRun()
    }
    
    addToken(nodeNum: number): void {
        let len = this.runs.length
        let states = this.runs[len - 1].state
        
        for (let idx = 0; idx < states.length; idx++) {
            let nodeState = states[idx];
            if (nodeState.nodeNum === nodeNum) {
                console.log("A")
                nodeState.token++
                break
            }
            if (idx === states.length - 1) {
                console.log("B")
                states.push({
                    nodeNum: nodeNum,
                    token: 1, 
                })
                break;
            }
        }
        
        if (states.length === 0) {
            console.log("C")
            states.push({
                nodeNum: nodeNum,
                token: 1, 
            })
            // return
        }
    }
    
    export(): Data {
        return {
            gameNumber: this.gameNumber,
            runs: this.runs,
            totalTime: -1,
        }
    }
    
}

type Data = {
    gameNumber: number,
    runs: GameRun[],
    totalTime: number
}

type GameRun = {
    state: NodeState[],
    step: number,
}

// NOTE: It's a bit annoying that we can add nodes in later steps of the game. As no parameters in the game
// change, I don't see how that would be useful.
type NodeState = {
    nodeNum: number,
    token: number,
}