'use strict';

var express = require('express');
var router = express.Router();

/* GET all routes */
router.get('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

module.exports = router;
