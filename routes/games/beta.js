const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('/dev/beta/instructions')
});

router.get('/instructions', function(req, res, next) {
    user = req.cookies.get('user')
    console.log(user)
    res.render('beta/instructions.pug', {game: "beta"});
});

router.get('/game', function(req, res, next) {
    res.render('beta/game.pug', {game: "beta"});
});

router.get('/review', function(req, res, next) {
    res.render('beta/review.pug', {game: "beta"});
});

module.exports = router;