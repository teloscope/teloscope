const express = require('express');
const router = express.Router();
const fs = require('fs');
const TestModel = require('../models/test');
const SnapShot = require('../models/snapshot')
const alphaRouter = require('./games/alpha')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/dev/intro');
});

router.get('/intro', function(req, res, next) {
  // console.log("writing to database")
  // const testEntry = new TestModel({
  //   name: "Jimmy"
  // })
  // testEntry.save()
  res.render('introduction.pug');
});

router.use('/alpha', alphaRouter)

// add game routes
// router.get('/alpha', async function(req, res, next) {
//   const test = await TestModel.find()
//   console.log(test)
//   res.redirect('/dev/alpha/instructions')
// });

// router.get('/alpha/instructions', function(req, res, next) {
//   res.render('alpha/instructions.pug', {game: "alpha"});
// });

// router.get('/alpha/game', function(req, res, next) {
//   res.render('alpha/game.pug',  {game: "alpha"});
// });

// router.get('/alpha/review', function(req, res, next) {
//   res.render('alpha/review.pug',  {game: "alpha"});
// });

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
  res.render('beta/review.pug', {game: "beta"});
});

router.get('/gamma', function(req, res, next) {
  res.redirect('/dev/gamma/instructions')
});

router.get('/gamma/instructions', function(req, res, next) {
  res.render('gamma/instructions.pug', {game: "gamma"});
});

router.get('/gamma/game', function(req, res, next) {
  res.render('gamma/game.pug', {game: "gamma"});
});

router.get('/gamma/review', function(req, res, next) {
  res.render('gamma/review.pug', {game: "gamma"});
});

// router.get('/delta', function(req, res, next) {
//   res.redirect('/dev/delta/instructions')
// });

// router.get('/delta/instructions', function(req, res, next) {
//   res.render('delta/instructions.pug', {game: "delta"});
// });

// router.get('/delta/game', function(req, res, next) {
//   res.render('delta/game.pug', {game: "delta"});
// });

// router.post('/delta/game', function(req, res, next) {
//   console.log("receiving post request for delta game")
//   let snapShot = new SnapShot();
//   snapShot.user = "Callie";
//   // console.log("data: " + req.body.data)
//   snapShot.img.data = new Buffer(req.body.data.split(",")[1],"base64")
//   snapShot.img.contentType = 'image/webp';
//   snapShot.save()
  
//   res.status(200).json({ message: "Successfully created snapshot"})
// })

router.get('/delta/review', function(req, res, next) {
  res.render('delta/review.pug', {game: "delta"});
});

router.get('/assessment', function(req, res, next) {
  res.render('assessment.pug');
});

module.exports = router;
