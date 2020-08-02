// This file outlines the data captured per game in delta

export type GameData = {
    playingTime: number,
    moves: number,
    undos: number,
    restarts: number,
    idleTime: number,
    
    // time it takes to form each sentence
    sentenceFormedTime: number[]
}

export function NewData(): GameData {
    return {
        playingTime: 0,
        moves: 0,
        undos: 0,
        restarts: 0,
        idleTime: 0,
        sentenceFormedTime: [],
    }
}