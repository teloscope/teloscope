const express = require('express');
const router = express.Router();
// const getUserID = require('../utils')
const { DeltaData } = require('../../models/delta')
const { DeltaReview } = require('../../models/delta')

router.get('/', function(req, res, next) {
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

router.post('/game', async function(req, res, next) {
    console.log("received data:")
    console.log(req.body)
    let user = getUserID(req, res)
    let data = await DeltaData.find({user: user})
    if (data !== null) {
        return res.status(200).send({"message": "Already received data from user for delta game"})
    }
    data = new DeltaData({
        user: user,
        gameNumber: req.body.gameNumber,
        playingTime: req.body.playingTime,
        undos: req.body.undos,
        restarts: req.body.restarts,
        idleTime: req.body.idleTime,
        sentenceFormedTime: req.body.sentenceFormedTime,
    })
    data.save()
    return res.status(200).send({"message": "Successfully saved user data for delta game"})
})

router.get('/review', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('delta/review', {game: "delta"});
});

router.post('/review', async function(req, res) {
    console.log("received review")
    let user = getUserID(req, res)
    // check that the user hasn't already submitted a review
    let review = await DeltaReview.find({user: user})
    if (review === null) {
        review = new DeltaReview({
            user: user,
            learningRate: (req.body.learning) ? parseInt(req.body.learning) : 0,
            difficulty: (req.body.difficulty) ? parseInt(req.body.difficulty) : 0,
            testing: req.body.testing,
            performance: (req.body.performance) ? parseInt(req.body.performance) : 0,
            improvements: req.body.improvements,
            overall: (req.body.overall) ? parseInt(req.body.overall): 0,
            general: req.body.general,
        })
        console.log(review)
        review.save()
    }
    return res.render('assessment.pug')
})

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

