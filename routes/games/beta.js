const express = require('express');
const router = express.Router();
const { BetaReview } = require('../../models/beta')
const { BetaData } = require('../../models/beta')

router.get('/', function(req, res, next) {
    res.redirect('/dev/beta/instructions')
});

router.get('/instructions', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('beta/instructions.pug', {game: "beta"});
});

router.get('/game', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('beta/game.pug', {game: "beta"});
});

router.post('/game', async function(req, res, next) {
    console.log("received data:")
    console.log(req.body)
    let user = getUserID(req, res)
    if (await BetaData.exists({user: user, gameNumber: req.body.gameNumber})) {
        console.log("Already received data for the same beta game and user")
        return res.status(200).send({"message": "Already received data from user for delta game"})
    }
    data = new BetaData({
        user: user,
        gameNumber: req.body.gameNumber,
        score: req.body.score,
        lostBalanceCounter: req.body.lostBalanceCounter,
        completedTime: req.body.completedTime,
        estimatedTime: req.body.estimatedTime,
    })
    
    data.save()
    console.log("saved data for beta game")
    return res.status(200).send({"message": "Successfully saved user data for delta game"})
})

router.get('/review', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('beta/review.pug', {game: "beta"});
});

router.post('/review', async function(req, res, next) {
    console.log("received review")
    let user = getUserID(req, res)
    if (await BetaReview.exists({user: user})) {    
        console.log("review already exists")
        return res.render('gamma/instructions.pug', {game: "gamma"})
    }
    let review = new BetaReview({
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
    return res.render('gamma/instructions.pug', {game: "gamma"})
})

function getUserID(req, res) {
    let user = req.cookies.get('user')
    if (!user) {
        res.redirect('/dev/intro')
        return
    } else {
        return user
    }
}

module.exports = router;