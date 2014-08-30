'use strict';

var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    moment    = require('moment'),
    maps      = require('../maps'),
    OAuth     = require('../utils/oauth');

/* GET status */
router.get('/:id([0-9]+)', function(req, res, next) {

  var requestedDate = moment()
    .zone('+0200')
    .format('YYYY-MM-DD HH:mm:ss');

  var params = {
    'requestedDate' : requestedDate,
    'dateType'      : 1,
    'trainNumber'   : req.params.id,
    'language'      : 3
  };

  request.get(new OAuth('RetrieveTrainSchedule', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    res.json(maps.trains.train(body));
  });

});

module.exports = router;
