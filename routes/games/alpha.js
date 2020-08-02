const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
    res.redirect('/dev/alpha/instructions')
});

router.get('/instructions', function(req, res, next) {
    res.render('alpha/instructions.pug', {game: "alpha"});
});

router.get('/game', function(req, res, next) {
    res.render('alpha/game.pug',  {game: "alpha"});
});

router.get('/review', function(req, res, next) {
    res.render('alpha/review.pug',  {game: "alpha"});
});

module.exports = router;