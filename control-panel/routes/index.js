const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn} = require('../middleware/authModule');

router.get('/', isLoggedIn, (req, res) => {
    res.render('pages/home', { user: req.user});
  });

router.get('/account', isLoggedIn,(req, res) => {
      res.render('pages/account', { user: req.user});
  });

router.get('/login', (req, res) => {
    res.render('pages/login');
  });

router.post('/login', passport.authenticate('local', {failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
  });

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

module.exports = router;