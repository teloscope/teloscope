const express = require('express');
const router = express.Router();
// const getUserID = require('../utils')
const DeltaData = require('../../models/delta')

router.get('/', function(req, res, next) {
    _ = getUserID(req, res)
    res.redirect('/dev/delta/instructions')
});

router.get('/instructions', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('delta/instructions.pug', {game: "delta"});
});

router.get('/game', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('delta/game', {game: "delta"});
});

router.post('/game', function(req, res, next) {
    console.log("received data:")
    console.log(req.body)
    user = getUserID(req, res)
    let data = new DeltaData({
        user: user,
        playingTime: req.body.playingTime,
        undos: req.body.undos,
        restarts: req.body.restarts,
        idleTime: req.body.idleTime,
        sentenceFormedTime: req.body.sentenceFormedTime,
    })
    data.save()
    res.status(200).send({"message": "Successfully saved user data"})
})

router.get('/review', function(req, res, next) {
    res.render('delta/review', {game: "delta"});
});

function getUserID(req, res) {
    user = req.cookies.get('user')
    if (!user) {
        res.redirect('/dev/intro')
        return
    } else {
        return user
    }
}

module.exports = router;

