'use strict';

var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    moment    = require('moment'),
    ex        = require('../lib/error'),
    OAuth     = require('../lib/oauth');

/* GET status */
router.get('/', function(req, res, next) {

  var from = parseInt(req.query.from) || 0;
  var to   = parseInt(req.query.to)   || 0;

  var searchType = 1;
  var dateTime   = moment().zone('+0200').format('YYYY-MM-DD HH:mm:ss');

  if (req.query.arrival) { // user requested specific arrival time
    searchType  = 0;
    dateTime    = req.query.arrival;
  } else {                // user requested specific departure time or "now"
    searchType  = 1;
    dateTime    = req.query.departure || dateTime;
  }

  var params = {
    resultCountBefore   : 0,
    departureStationId  : from,
    dateTime            : dateTime,
    arrivalStationId    : to,
    searchType          : 1,
    minTransferTime     : 0,
    resultCountAfter    : 3
  };

  request.get(new OAuth('RetrieveRoutes', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200) {
      return res.json(500, new ex.RailtimeException('Could not resolve route'));
    }

    res.json(body);
  });

});

module.exports = router;
