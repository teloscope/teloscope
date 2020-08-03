const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('/dev/gamma/instructions')
});

router.get('/instructions', function(req, res, next) {
    res.render('gamma/instructions.pug', {game: "gamma"});
});

router.get('/game', function(req, res, next) {
    res.render('gamma/game.pug', {game: "gamma"});
});

router.get('/review', function(req, res, next) {
    res.render('gamma/review.pug', {game: "gamma"});
});

module.exports = router;
