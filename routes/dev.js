var express = require('express');
var router = express.Router();
const TestModel = require('../models/test');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/dev/intro');
});

router.get('/intro', function(req, res, next) {
  console.log("writing to database")
  const testEntry = new TestModel({
    name: "Jimmy"
  })
  testEntry.save()
  res.render('introduction.pug');
});

// add game routes
router.get('/alpha', async function(req, res, next) {
  const test = await TestModel.find()
  console.log(test)
  res.redirect('/dev/alpha/instructions')
});

router.get('/alpha/instructions', function(req, res, next) {
  res.render('alpha/instructions.pug', {game: "alpha"});
});

router.get('/alpha/game', function(req, res, next) {
  res.render('alpha/game.pug',  {game: "alpha"});
});

router.get('/alpha/review', function(req, res, next) {
  res.render('alpha/end.pug',  {game: "alpha"});
});

router.get('/beta', function(req, res, next) {
  res.redirect('/dev/beta/instructions')
});

router.get('/beta/instructions', function(req, res, next) {
  res.render('beta/instructions.pug', {game: "beta"});
});

router.get('/beta/game', function(req, res, next) {
  res.render('beta/game.pug', {game: "beta"});
});

router.get('/beta/review', function(req, res, next) {
  res.render('beta/end.pug', {game: "beta"});
});


router.get('/delta', function(req, res, next) {
  res.redirect('/dev/delta/instructions')
});

router.get('/delta/instructions', function(req, res, next) {
  res.render('delta/instructions.pug', {game: "delta"});
});

router.get('/delta/game', function(req, res, next) {
  res.render('delta/game.pug', {game: "delta"});
});

router.get('/delta/review', function(req, res, next) {
  res.render('delta/end.pug', {game: "delta"});
});

module.exports = router;
