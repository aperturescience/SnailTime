'use strict';

var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    // _         = require('lodash-node'),
    // maps      = require('../maps/disruptions.js'),
    OAuth     = require('../lib/oauth');

/* GET status */
router.get('/', function(req, res, next) {

  var params = {
    'detailLevel' : 'all',
    'language'    : 3
  };

  request.get(new OAuth('RetrieveInfoMessagesForSmartPhone', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    res.json(body);
  });

});

module.exports = router;
