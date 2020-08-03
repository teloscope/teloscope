const express = require('express');
const router = express.Router();
const fs = require('fs');
const TestModel = require('../models/test');
const SnapShot = require('../models/snapshot')
const alphaRouter = require('./games/alpha')
const betaRouter = require('./games/beta')
const gammaRouter = require('./games/gamma')
const deltaRouter = require('./games/delta')
const uuid = require('uuid');

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

router.get('/assessment', function(req, res, next) {
  res.render('assessment.pug');
});

module.exports = router;
