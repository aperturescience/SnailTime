'use strict';

var express = require('express');
var router  = express.Router();
var pjson   = require('../package.json');

/* GET index */
router.get('/', function(req, res) {
  res.json({
    'version'     : pjson.version,
    'author'      : pjson.contributors,
    'website'     : pjson.website,
    'repository'  : pjson.repository.url
  });
});

module.exports = router;
