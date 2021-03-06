'use strict';

var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    datetime  = require('../utils/datetime'),
    maps      = require('../maps'),
    OAuth     = require('../utils/oauth');

/* GET status */
router.get('/:id([0-9]+)', function(req, res, next) {

  var requestedDate = datetime.toCET().format('YYYY-MM-DD HH:mm:ss');

  var params = {
    'requestedDate' : requestedDate,
    'dateType'      : 1,
    'trainNumber'   : req.params.id,
    'language'      : 3
  };

  request.get(new OAuth('RetrieveTrainSchedule', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    maps.trains.train(body, req.locale, function(err, train) {

      if (err)
        res.send(resp.statusCode || 500, { error: err });
      else
        res.json(train);
    });

  });

});

module.exports = router;
