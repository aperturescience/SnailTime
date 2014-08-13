'use strict';

var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    moment    = require('moment'),
    _         = require('lodash-node'),
    maps      = require('../maps/stations.js'),
    OAuth     = require('../lib/oauth');

/* GET status */
router.get('/:id([0-9]+)/:subset(arrivals|departures)?', function(req, res, next) {

  var dateTimeFrom = moment()
    .zone('+0200')
    .format('YYYY-MM-DD HH:mm:ss');

  var dateTimeTo   = moment()
    .zone('+0200')
    .add(1, 'hours')
    .format('YYYY-MM-DD HH:mm:ss');

  var params = {
    'dateTimeFrom'  : dateTimeFrom,
    'dateTimeTo'    : dateTimeTo,
    'searchType'    : 0,
    'stationID'     : req.params.id
  };

  request.get(new OAuth('RetrieveStationSchedule', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    body = maps.mapStation(body, req.locale);

    var sort, reject;

    if (req.params.subset === 'arrivals') {
      sort = 'arrival';
      reject = function(train) { return train.arrival === null; };
    } else if (req.params.subset === 'departures') {
      sort = 'departure';
      reject = function(train) { return train.departure === null; };
    }

    body.trains = _.chain(body.trains)
      .reject(reject)
      .sortBy(sort)
      .value();

    res.json(body);
  });

});

module.exports = router;
