export type GameData = {
    finalScore: number,
    tasksCompleted: number[],
}

export function NewData(): GameData {
    return {
        finalScore: 0,
        tasksCompleted: [],
    }
}