const express = require('express');
const router = express.Router();
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
    if (await DeltaData.exists({user: user, gameNumber: req.body.gameNumber})) {
        console.log("Already received data for the same delta game and user")
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
    console.log("saved data for delta game")
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
    if (await DeltaReview.exists({user: user})) {
        console.log("review already exists")
        return res.render('assessment.pug')
    }
    const review = new DeltaReview({
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
    return res.render('closing.pug')
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

