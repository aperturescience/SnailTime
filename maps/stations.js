'use strict';

var _         = require('lodash-node'),
    datetime  = require('../utils/datetime'),
    stations  = require('../db/stations'),
    async     = require('async');

exports.station = function(station, locale, callback) {

  locale = locale || null;

  var trains = _.map(station.Trains, function(train) {

    return {
      'number'          : train.TrainNumber,
      'type'            : train.CommercialTypes[0] || null,

      'origin'          : train.Origins[0],
      'destination'     : train.Destinations[0],

      'track'           : train.Track,

      'arrival'         : train.ArrivalDateTime
      ? {
        'time'     : datetime.toCET(train.ArrivalDateTime).toISOString(),
        'relative' : datetime.toCET(train.ArrivalDateTime).locale(locale).fromNow(),
        'delay'    : train.ArrivalDelay,
        'arrived'  : train.ArrivalDetected,
      }
      : null,

      'departure'       : train.DepartureDateTime
      ? {
        'time'     : datetime.toCET(train.DepartureDateTime).toISOString(),
        'relative' : datetime.toCET(train.DepartureDateTime).locale(locale).fromNow(),
        'delay'    : train.DepartureDelay,
        'departed' : train.DepartureDetected,
      }
      : null,

      // Modifications to regular schedule
      'modified'        : train.RouteModified || train.TrackModified
      ? {
        'route' : train.RouteModified,
        'track' : train.TrackModified
      }
      : false

    };

  });

  async.parallel({

    station: function(callback) {

      stations.byId(station.Id, function(err, station) {
        if (err)
          callback(err);
        else
          callback(null, station);
      });

    },

    trains: function(callback) {

      async.each(trains, function(train, callback) {

        async.parallel({

          origin: function(callback) {

            stations.byId(train.origin, function(err, station) {
              if (err)
                callback(err);
              else
                callback(null, station);
            });

          },

          destination: function(callback) {

            stations.byId(train.destination, function(err, station) {
              if (err)
                callback(err);
              else
                callback(null, station);
            });

          }

        }, function(err, results) {

          if (err) {
            callback(err);
          } else {
            train.origin = results.origin;
            train.destination = results.destination;

            callback(null);
          }

        });

      }, function(err) {
        if (err)
          callback(err);
        else
          callback(null, trains);
      });

    }

  }, function(err, results) {

    callback(null, {
      'station' : results.station,
      'trains'  : results.trains
    });

  });

};

exports.list = function(stations, locale) {

  /*
    Show only Belgian
    Commercial stations
  */
  stations = _.filter(stations, {
    IsBelgianStation: true,
    IsCommercialStation: true,
    IsDeleted: false
  });

  return _.map(stations, function(station) {

    var stationName = station.NameNL;
    switch(locale) {
      case 'fr':
        stationName = station.NameFR;
        break;
      case 'nl':
        // NL is default
        break;
      case 'de':
        stationName = station.NameDE;
        break;
      case 'en':
        stationName = station.NameEN;
        break;
    }

    return {
      //'aliases'    : [],
      'id' : station.Id,
      //'belgian'    : station.IsBelgianStation,
      //'commercial' : station.IsCommercialStation,
      'name': stationName,
      'location': {
        'latitude'   : station.Latitude,
        'longitude'  : station.Longitude,
      }
    };

  });

};