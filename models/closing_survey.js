const mongoose = require('mongoose')

const ClosingReview = new mongoose.Schema({
    user: String,
    // What do you think of games as a tool for assessing someone's competency for a role. What do you think are the strengths and weaknesses?
    strengthAndWeaknesses: String,
    // What would you like to see more of generally when it comes to recruitment? What would you like to see less of?
    recruitment: Number,
    // What do you think of the prospect of multiplayer games?
    multiplayer: String,
    // Do you have a game or idea in mind that you think might be interesting to use in this context?
    gameIdea: Number,
    // Any final remarks?
    finalRemarks: String,
})

module.exports = mongoose.model('ClosingReview', DeltaReview)