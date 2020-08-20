const express = require('express');
const router = express.Router();
const { GammaData } = require('../../models/gamma')
const { GammaReview } = require('../../models/gamma')

router.get('/', function(req, res, next) {
    res.redirect('/dev/gamma/instructions')
});

router.get('/instructions', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('gamma/instructions.pug', {game: "gamma"});
});

router.get('/game', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('gamma/game.pug', {game: "gamma"});
});

router.post('/game', async function(req, res, next) {
    console.log("received data:")
    console.log(req.body)
    let user = getUserID(req, res)
    if (await GammaData.exists({user: user, gameNumber: req.body.gameNumber})) {
        console.log("Already received data from user for gamma game")
        return res.status(200).send({"message": "Already received data from user for gamma game"})
    }
    data = new GammaData({
        user: user,
        gameNumber: req.body.gameNumber,
        runs: req.body.runs, 
        totalTime: req.body.totalTime,
    })
    console.log(data)
    data.save()
    return res.status(200).send({"message": "Successfully saved user data for gamma game"})
})

router.get('/review', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('gamma/review.pug', {game: "gamma"});
});

router.post('/review', async function(req, res, next) {
    console.log("received review")
    let user = getUserID(req, res)
    // check to see if the user has already done the review
    if (await GammaReview.exists({user: user})) {
        console.log("review already exists")
        return res.render('delta/instructions.pug', {game: "delta"})
    }
    const review = new GammaReview({
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
    return res.render('delta/instructions.pug', {game: "delta"})
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
