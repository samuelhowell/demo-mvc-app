const express = require('express');
const app = express();
require('dotenv').config();
const compression = require('compression');
const path = require('path');
const helmet = require('helmet');
app.use(helmet());
app.use(compression());


/*
* passport-local setup using SHA256 salting and hashing
*/
const auth = require('./controllers/authController');
const sha = require('./controllers/shaController');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
app.use(
  require('express-session')({
    secret: 'demo',
    resave: true,
    saveUninitialized: false,
  })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new Strategy(function (username, password, cb) {
      auth.findByUsername(username, function (err, user) {
        const hashedQueryPassword = sha.hash(`${user.salt}${password}`);
        //hashedQueryPassword === user.password
        if (err) return cb(err);
        if (!user) return cb(null, false);
        if (user.pass != hashedQueryPassword.toString()) return cb(null, false);

        return cb(null, user);

      });
    })
  );

passport.serializeUser(function (user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
  auth.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});


/*
* routing and view setup
*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/api'));
app.use('/loans', require('./routes/loans'));


/*
* error checking and logging
*/
const createError = require('http-errors');
const logger = require('morgan');
app.use(logger('dev'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.STAGE === 'development' || process.env.DEBUG === 'on' ? err : {};
  res.status(err.status || 500);
    // verbose errors displayed on frontend when stage = development/debug when logged with role admin
    res.render('pages/error', { user: req.user});
});


/*
* server
*/
const port = normalizePort(process.env.PORT || 8080);

app.listen(port, () => {
  console.log(`Demo control panel server runnning on: ${port}`)
});

function normalizePort(envPortVal) {
  const port = parseInt(envPortVal, 10);
  if (isNaN(port)) return envPortVal;
  if (port >= 0) return port;
  return false;
}
