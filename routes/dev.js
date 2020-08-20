const express = require('express');
const router = express.Router();
// const fs = require('fs');
// const TestModel = require('../models/test');
// const SnapShot = require('../models/snapshot')
const alphaRouter = require('./games/alpha')
const betaRouter = require('./games/beta')
const gammaRouter = require('./games/gamma')
const deltaRouter = require('./games/delta')
const uuid = require('uuid');
const { route } = require('./games/beta');
const ClosingReview = require('../models/closing')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/dev/intro');
});

router.get('/intro', function(req, res, next) {
  let user = req.cookies.get('user')
  if (!user) {
    console.log("Welcome new user")
    let user = uuid.v4()
    req.cookies.set('user', user)
  } else {
    console.log("Welcome back " + user)
  }
  res.render('introduction.pug');
});

router.use('/alpha', alphaRouter)

router.use('/beta', betaRouter)

router.use('/gamma', gammaRouter)

router.use('/delta', deltaRouter)

// TODO: add self assessment
// router.get('/assessment', function(req, res, next) {
//   if (req.cookies.get('user')) {
//     res.render('assessment.pug');
//   } else {
//     res.redirect('/dev/intro')
//   }
// });

// router.post('/assessment', function(req, res, next) {
//   console.log("received assessment")
//   /*
//     TO BE COMPLETED
//   */
//   res.status(200).send({"message": "Successfully submitted assessment"})
// })

router.get('/closing', function (req, res) {
  res.render('closing.pug')
})

router.post('/closing', async function (req, res) {
  console.log("received survey")
  let user = req.cookies.get('user')
  if (!user) {
      res.redirect('/dev/intro')
  }
  if (await ClosingReview.exists({user: user})) {
    console.log("already received review")
    return res.render('closing.pug')
  }
  const review = new ClosingReview({
      user: user,
      strengthAndWeaknesses: req.body.strengthAndWeaknesses,
      recruitment: req.body.recruitment,
      multiplayer: req.body.multiplayer,
      gameIdea: req.body.gameIdea,
      finalRemarks: req.body.finalRemarks,
  })
  console.log(review)
  review.save()
  return res.render('closing.pug')
})

module.exports = router;
