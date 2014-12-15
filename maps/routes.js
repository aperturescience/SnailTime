/**
 * This file will map the routes to a human-readable JSON format
 */

'use strict';

var _         = require('lodash-node'),
    async     = require('async'),
    datetime  = require('../utils/datetime'),
    stations  = require('../db/stations');

exports.route = function(directions, locale, callback) {

  locale = locale || null;

  var routes = _.map(directions.Routes, function(route) {

    return {

      'arrival'     : route.ArrivalDateTime
      ? {
        'time'      : datetime.toCET(route.ArrivalDateTime).toISOString(),
        'relative'  : datetime.toCET(route.ArrivalDateTime).locale(locale).fromNow(),
        'delay'     : route.ArrivalDelay,
        'arrived'   : route.ArrivalDetected,
      }
      : undefined,

      'departure'   : route.DepartureDateTime
      ? {
        'time'      : datetime.toCET(route.DepartureDateTime).toISOString(),
        'relative'  : datetime.toCET(route.DepartureDateTime).locale(locale).fromNow(),
        'delay'     : route.DepartureDelay,
        'departed'  : route.DepartureDetected,
      }
      : undefined,

      'connections' : route.Connections,
      'types'       : route.CommercialTypes,

      'travelTime'  : route.TravelTime,

      'transports'  : _.map(route.Transports, function(transport) {
        return {

          'arrival'     : transport.ArrivalDateTime
          ? {
            'station'   : {
              'id': transport.ArrivalStationId
            },
            'time'      : datetime.toCET(transport.ArrivalDateTime).toISOString(),
            'relative'  : datetime.toCET(transport.ArrivalDateTime).locale(locale).fromNow(),
            'track'     : transport.ArrivalTrack,
            'delay'     : transport.ArrivalDelay,
            'arrived'   : transport.ArrivalDetected,
          }
          : undefined,

          'departure'   : transport.DepartureDateTime
          ? {
            'station'   : {
              'id': transport.DepartureStationId
            },
            'time'      : datetime.toCET(transport.DepartureDateTime).toISOString(),
            'relative'  : datetime.toCET(transport.DepartureDateTime).locale(locale).fromNow(),
            'track'     : transport.DepartureTrack,
            'delay'     : transport.DepartureDelay,
            'departed'  : transport.DepartureDetected,
          }
          : undefined,

        };

      }),

      'modified'    : {
        'route' : route.RouteModified
      }
    };
  });

  async.parallel({

    departure: function(callback) {
      stations.byId(directions.DepartureStationId, function(err, station) {
        if (err)
          callback(err);
        else
          callback(null, station);
      });
    },

    arrival: function(callback) {
      stations.byId(directions.ArrivalStationId, function(err, station) {
        if (err)
          callback(err);
        else
          callback(null, station);
      });
    },

    transports: function(callback) {

      async.each(routes, function(route, callback) {
        async.each(route.transports, function(transport, callback) {

          async.parallel({

            arrival: function(callback) {
              stations.byId(transport.arrival.station.id, function(err, station) {
                if (err)
                  callback(err);
                else
                  callback(null, station);
              });
            },

            departure: function(callback) {
              stations.byId(transport.departure.station.id, function(err, station) {
                if (err)
                  callback(err);
                else
                  callback(null, station);
              });
            },

          }, function(err, results) {

            transport.arrival.station   = results.arrival;
            transport.departure.station = results.departure;

            if (err)
              callback(err);
            else
              callback(null, transport);
          });

        }, function(err, transports) {
          if (err)
            callback(err);
          else
            callback(null);
        });

      }, function(err) {
        if (err)
          callback(err);
        else
          callback(null);
      });

    }

  }, function(err, results) {

    if (err)
      callback(err);
    else
      callback(null, {
        'departure' : results.departure,
        'arrival'   : results.arrival,

        'route'     : routes
      });

  });

};