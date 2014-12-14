'use strict';

var _           = require('lodash-node'),
    datetime    = require('../utils/datetime'),
    stationsDB  = require('../db/stations'),
    async       = require('async');

/**
 *  Mapping train data
 */

exports.train = function(train, locale, callback) {

  locale = locale || null;

  var route = _.map(train.Route, function(station) {

    return {

      'station'     : {
        'id': station.StationId
      },

      'arrival'     : station.ArrivalDateTime
      ? {
        'time'      : datetime.toCET(station.ArrivalDateTime).toISOString(),
        'relative'  : datetime.toCET(station.ArrivalDateTime).locale(locale).fromNow(),
        'delay'     : station.ArrivalDelay,
        'arrived'   : station.ArrivalDetected,
      }
      : undefined,

      'departure'   : station.DepartureDateTime
      ? {
        'time'      : datetime.toCET(station.DepartureDateTime).toISOString(),
        'relative'  : datetime.toCET(station.DepartureDateTime).locale(locale).fromNow(),
        'delay'     : station.DepartureDelay,
        'departed'  : station.DepartureDetected,
      }
      : undefined,

      'track'       : station.Track,

      'modified'    : {
        'track' : station.TrackModified
      }
    };

  });

  async.parallel({

    origin: function(callback) {

      stationsDB.byId(train.Origins[0], function(err, station) {
        if (err)
          callback(err);
        else
          callback(null, station);
      });

    },

    destination: function(callback) {

      stationsDB.byId(train.Destinations[0], function(err, station) {
        if (err)
          callback(err);
        else
          callback(null, station);
      });

    },

    route: function(callback) {

      async.each(route, function(stop, callback) {

        stationsDB.byId(stop.station.id, function(err, station) {
          if (err) {
            callback(err);
          } else {
            stop.station = station;
            callback(null, station);
          }
        });

      }, function(err, result) {

        if (err)
          callback(err);
        else
          callback(null, route);

      });

    }

  }, function(err, results) {

    callback(null, {

      'number'        : train.TrainNumber,
      'type'          : train.CommercialTypes[0] || undefined,

      'origin'        : results.origin,
      'destination'   : results.destination,

      'route'         : results.route,

      'modified'      : {
        'route' : train.RouteModified
      }

    });

  });

};