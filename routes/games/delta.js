const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('//instructions');
});

router.get('/instructions', function(req, res, next) {
    res.render('//instructions');
});

router.get('/game', function(req, res, next) {
    res.render('//game');
});

router.post('/game', function(req, res, next) {
    console.log("received data:")
    console.log(req.body)
    res.status(200).send()
})

router.get('/end', function(req, res, next) {
    res.render('//end');
});