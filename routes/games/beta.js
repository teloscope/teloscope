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

router.post('/review', function(req, res, next) {
    console.log("received review")
    let user = getUserID(req, res)
    let review = new BetaReview({
        user: user,
        learningRate: parseInt(req.body.learningRate),
        difficulty: parseInt(req.body.difficulty),
        testing: req.body.testing,
        performance: parseInt(req.body.performance),
        improvements: req.body.improvements,
        overall: parseInt(req.body.overall),
    })
    review.save()
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