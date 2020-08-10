const express = require('express');
const router = express.Router();
const AlphaReview = require('../../models/alpha')

router.get('/', async function(req, res, next) {
    _ = getUserID(req, res)
    res.redirect('/dev/alpha/instructions')
});

router.get('/instructions', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('alpha/instructions.pug', {game: "alpha"});
});

router.get('/game', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('alpha/game.pug',  {game: "alpha"});
});

router.get('/review', function(req, res, next) {
    _ = getUserID(req, res)
    res.render('alpha/review.pug',  {game: "alpha"});
});

router.post('/review', function(req, res, next) {
    console.log("received review")
    const user = getUserID(req, res)
    let review = new AlphaReview({
        user: user,
        learningRate: (req.body.learning) ? parseInt(req.body.learning) : 0,
        difficulty: (req.body.difficulty) ? parseInt(req.body.difficulty) : 0,
        testing: req.body.testing,
        performance: (req.body.performance) ? parseInt(req.body.performance) : 0,
        improvements: req.body.improvements,
        overall: (req.body.overall) ? parseInt(req.body.overall): 0,
    })
    console.log(review)
    review.save()
    res.render('beta/instructions.pug', {game: "beta"})
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