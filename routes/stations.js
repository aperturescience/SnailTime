'use strict';

var express   = require('express'),
    ex        = require('../utils/error'),
    request   = require('request'),
    router    = express.Router(),
    _         = require('lodash-node'),
    maps      = require('../maps'),
    datetime  = require('../utils/datetime'),
    db        = require('../db/stations'),
    OAuth     = require('../utils/oauth');

/* SEARCH station */
router.get('/search', function(req, res, next) {

  var query = req.query.q;
  var limit = parseInt(req.query.limit) || 5;

  // No search query specified
  if (_.isUndefined(query)) {
    return res.json(400, new ex.BadRequestException('Empty search query'));
  }

  // Query too small
  if (query.length < 3) {
    return res.json(400, new ex.BadRequestException('Search query too small'));
  }

  db.levenLookup(query, limit, function(err, results) {
    if (err)
      return res.json(500, new ex.UnknownException('Error searching for stations'));

    return res.json(results);
  });
});

/* GET station */
router.get('/:station/:subset(arrivals|departures)?', function(req, res, next) {

  var dateTimeFrom = datetime.toCET().format('YYYY-MM-DD HH:mm:ss');

  var dateTimeTo   = datetime.toCET()
    .add(1, 'hours')
    .format('YYYY-MM-DD HH:mm:ss');

  var params = {
    'dateTimeFrom'  : dateTimeFrom,
    'dateTimeTo'    : dateTimeTo,
    'searchType'    : 0,
  };

  if (isFinite(req.params.station)) {
    params.stationID = req.params.station;
    makeRequest(params);
  }

  else
    db.levenLookup(req.params.station, function(err, result) {

      params.stationID = result.id;

      // no results from lookup returns Infinity
      if (isFinite(result.score))
        makeRequest(params);
      else
        return res.json(404, new ex.StationNotFoundException(req.params.station));
    });

  function makeRequest(params) {

    request.get(new OAuth('RetrieveStationSchedule', params), function(err, resp, body) {

      if (err || resp.statusCode !== 200)
        return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

      maps.stations.station(body, req.locale, function(err, body) {

        if (err)
          return res.send(resp.statusCode || 500, { error: err });

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
          reject = _.noop;
        }

        body.trains = _.chain(body.trains)
          .reject(reject)
          .sortBy(sort)
          .value();

        res.json(body);
      });
    });

  }

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
