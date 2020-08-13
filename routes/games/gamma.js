const express = require('express');
const router = express.Router();
const GammaReview = require('../../models/gamma')

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

router.get('/review', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('gamma/review.pug', {game: "gamma"});
});

router.post('/review', async function(req, res, next) {
    console.log("received review")
    let user = getUserID(req, res)
    // check to see if the user has already done the review
    let review = await GammaReview.find({user: user})
    if (review === null) {
        review = new GammaReview({
            user: user,
            learningRate: (req.body.learning) ? parseInt(req.body.learning) : 0,
            difficulty: (req.body.difficulty) ? parseInt(req.body.difficulty) : 0,
            testing: req.body.testing,
            performance: (req.body.performance) ? parseInt(req.body.performance) : 0,
            improvements: req.body.improvements,
            overall: (req.body.overall) ? parseInt(req.body.overall): 0,
            general: req.body.general,
        })
        review.save()
    }
    res.render('delta/instructions.pug', {game: "delta"})
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
