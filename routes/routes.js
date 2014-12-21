'use strict';

var express   = require('express'),
    _         = require('lodash-node'),
    async     = require('async'),
    db        = require('../db/stations'),
    request   = require('request'),
    router    = express.Router(),
    datetime  = require('../utils/datetime'),
    maps      = require('../maps'),
    ex        = require('../utils/error'),
    OAuth     = require('../utils/oauth');

/* GET status */
router.get('/', function(req, res, next) {

  if (_.isEmpty(req.query.from) || _.isEmpty(req.query.to))
    return res.json(400, new ex.BadRequestException('Please provide a valid destination and arrival station'));

  var searchType = 1;
  var dateTime   = datetime.toCET().format('YYYY-MM-DD HH:mm:ss');

  if (req.query.arrival) { // user requested specific arrival time
    searchType  = 0;
    dateTime    = req.query.arrival;
  } else {                // user requested specific departure time or "now"
    searchType  = 1;
    dateTime    = req.query.departure || dateTime;
  }

  var params = {
    resultCountBefore   : 0,
    dateTime            : dateTime,
    searchType          : 1,
    minTransferTime     : 0,
    resultCountAfter    : 3
  };

  async.parallel({

    from: function(callback) {

      if (isFinite(req.query.from))
        return callback(null, parseInt(req.query.from));

      db.levenLookup(req.query.from, function(err, result) {
        params.stationID = result.id;

        if (isFinite(result.score))
          callback(null, result.id);
        else
          return res.json(404, new ex.StationNotFoundException(req.query.from));
      });

    },

    to: function(callback) {

      if (isFinite(req.query.to))
        return callback(null, parseInt(req.query.to));

      db.levenLookup(req.query.to, function(err, result) {
        params.stationID = result.id;

        if (isFinite(result.score))
          callback(null, result.id);
        else
          return res.json(404, new ex.StationNotFoundException(req.query.to));
      });

    }

  }, function(err, results) {

    if (err)
      return res.json(500, err);

    params.departureStationId = results.from;
    params.arrivalStationId   = results.to;

    makeRequest(params);
  });

  function makeRequest(params) {

    request.get(new OAuth('RetrieveRoutes', params), function(err, resp, body) {

      if (err || resp.statusCode !== 200) {
        return res.json(500, new ex.RailtimeException('Could not resolve route'));
      }

      maps.routes.route(body, req.locale, function(err, directions) {
        if (err)
          res.send(resp.statusCode || 500, { error: err });
        else
          res.json(directions);
      });

    });

  }

});

module.exports = router;
