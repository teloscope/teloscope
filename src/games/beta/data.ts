// This file outlines the data captured per game in delta

export type GameData = {
    gameNumber: number,
    score: number,
    lostBalanceCount: number,
    completedTime: number, // -1 is used to mean that they didn't complete the challenge.
    estimatedTime: number
}

export function NewData(): GameData {
    return {
        gameNumber: 0,
        score: 0,
        lostBalanceCount: 0,
        completedTime: -1,
        estimatedTime: 0
    }
}