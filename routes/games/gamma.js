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

router.post('/review', function(req, res, next) {
    console.log("received review")
    let user = getUserID(req, res)
    let review = new GammaReview({
        user: user,
        learningRate: (req.body.learningRate) ? parseInt(req.body.learningRate) : 0,
        difficulty: parseInt(req.body.difficulty),
        testing: req.body.testing,
        performance: parseInt(req.body.performance),
        improvements: req.body.improvements,
        overall: parseInt(req.body.overall),
    })
    review.save()
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
