'use strict';

var express     = require('express');
var logger      = require('morgan');
var bodyParser  = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/**
 * Custom middleware
 */
app.use(function(req, res, next) {
  res.setHeader( 'X-Powered-By', 'demey.io' );
  next();
});

/**
 * Routes
 */
app.use('/',        require('./routes/index'));
app.use('/status',  require('./routes/status'));
app.use('/stations', require('./routes/stations'));

/**
 * 404 handler
 */
 app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Development error handler
 */
if (app.get('env') !== 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: err
    });
  });
}

/**
 * Production error handler
 */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
