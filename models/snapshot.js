const mongoose = require('mongoose')

const SnapShotSchema = new mongoose.Schema({
    user: {
        type: String
    },
    img: { 
        data: Buffer, 
        contentType: String}
}, {
    timestamps: true
})

module.exports = mongoose.model('SnapShot', SnapShotSchema);
