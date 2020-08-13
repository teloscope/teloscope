const express = require('express');
const router = express.Router();
const BetaReview = require('../../models/beta')

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

router.get('/review', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('beta/review.pug', {game: "beta"});
});

router.post('/review', async function(req, res, next) {
    console.log("received review")
    let user = getUserID(req, res)
    let review = await BetaReview.find({user: user})
    if (review === null) {
        review = new BetaReview({
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
    res.render('gamma/instructions.pug', {game: "gamma"})
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