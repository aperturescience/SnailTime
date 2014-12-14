'use strict';

var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    _         = require('lodash-node'),
    maps      = require('../maps'),
    utils     = require('../utils'),
    datetime  = require('../utils/datetime'),
    OAuth     = require('../utils/oauth');

/* GET status */
router.get('/:id([0-9]+)/:subset(arrivals|departures)?', function(req, res, next) {

  var dateTimeFrom = datetime.toCET().format('YYYY-MM-DD HH:mm:ss');

  var dateTimeTo   = datetime.toCET()
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

    maps.stations.station(body, req.locale, function(err, body) {

      var sort, reject;

      if (req.params.subset === 'arrivals') {

        sort   = 'arrival';
        reject = function(train) {
          return train.arrival === null;
        };

      } else if (req.params.subset === 'departures') {

        sort   = 'departure';
        reject = function(train) {
          return train.departure === null;
        };

      } else {
        sort   = 'departure';
        reject = utils.noop;
      }

      body.trains = _.chain(body.trains)
        .reject(reject)
        .sortBy(sort)
        .value();

      res.json(body);
    });
  });

});

/* GET index */
router.get('/', function(req, res, next) {

  var params = {
    // 'LastUpdateDate': '1970-08-11 3:35:53 am'
  };

  request.get(new OAuth('RetrieveStationList', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    // basic cache control
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());

    res.json(maps.stations.list(body, req.locale));
  });

});

module.exports = router;
