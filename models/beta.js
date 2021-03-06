const mongoose = require('mongoose')

const BetaDataSchema = new mongoose.Schema({
    user: { type: String, required: true },
    gameNumber: Number,
    lostBalanceCount: Number,
    completedTime: Number,
    estimatedTime: Number,
})

// NOTE: multi-choice questions are provided as a number from 1 - 5
const BetaReviewSchema = new mongoose.Schema({
    user: { type: String, required: true },
    // How quickly do you think you learned how to solve the challenges?
    learningRate: Number,
    // How difficult did you find the game?
    difficulty: Number,
    // At a guess, what skills do you think the game was testing?
    testing: String,
    // How well do you think you performed in the game?
    performance: Number,
    // What did you not like about the game or think could be improved?
    improvements: String,
    // Overall, what did you think of the game?
    overall: Number,
    // Do you have any general comments you would like to add?
    general: String,
})

module.exports = {
    BetaData: mongoose.model('BetaData', BetaDataSchema),
    BetaReview: mongoose.model('BetaReview', BetaReviewSchema)
}