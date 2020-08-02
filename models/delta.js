const mongoose = require('mongoose')

const DeltaSchema = new mongoose.Schema({
    user: String,
    playingTime: Number,
    undos: Number,
    restarts: Number,
    idleTime: Number,
    sentenceFormedTime: [Number]
})

module.exports = mongoose.model('DeltaData', DeltaSchema);

// playingTime: number,
//     moves: number,
//     undos: number,
//     restarts: number,
//     idleTime: number,
    
//     // time it takes to form each sentence
//     sentenceFormedTime: number[]