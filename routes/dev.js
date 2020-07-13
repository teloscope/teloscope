var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/dev/intro');
});

router.get('/intro', function(req, res, next) {
  res.render('introduction.pug');
});

// add game routes
router.get('/alpha', function(req, res, next) {
  res.redirect('/dev/alpha/instructions')
});

router.get('/alpha/instructions', function(req, res, next) {
  res.render('alpha/instructions.pug');
});

router.get('/alpha/game', function(req, res, next) {
  res.render('alpha/game.pug');
});

router.get('/alpha/review', function(req, res, next) {
  res.render('alpha/end.pug');
});


router.get('/delta', function(req, res, next) {
  res.redirect('/dev/delta/instructions')
});

router.get('/delta/instructions', function(req, res, next) {
  res.render('delta/instructions.pug');
});

router.get('/delta/game', function(req, res, next) {
  res.render('delta/game.pug');
});

router.get('/delta/review', function(req, res, next) {
  res.render('delta/end.pug');
});

module.exports = router;
