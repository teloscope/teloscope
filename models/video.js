const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
    user : {
        type: String
    },
    video: { 
        data: Buffer, 
        contentType: String}
}, {
    timestamps: true
})

module.exports = mongoose.model('Video', VideoSchema);
