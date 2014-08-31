'use strict';

var _         = require('lodash-node'),
    datetime  = require('../utils/datetime');

exports.station = function(data, locale) {

  locale = locale || null;

  var trains = _.map(data.Trains, function(train) {

    return {
      'arrival'         : datetime.toCET(train.ArrivalDateTime).toISOString() || null,
      'arrival_str'     : (function() {
        return train.ArrivalDateTime === null
          ? null
          : datetime.toCET(train.ArrivalDateTime).locale(locale).fromNow();
      })(),
      'arrival_delay'   : train.ArrivalDelay,
      'has_arrived'     : train.ArrivalDetected,

      'departure'       : datetime.toCET(train.DepartureDateTime).toISOString() || null,
      'departure_str'   : (function() {
        return train.DepartureDateTime === null
          ? null
          : datetime.toCET(train.DepartureDateTime).locale(locale).fromNow();
      })(),
      'departure_delay' : train.DepartureDelay,
      'has_departed'    : train.DepartureDetected,

      'track'           : train.Track,

      'origin'          : train.Origins[0],
      'destination'     : train.Destinations[0],

      'type'            : train.CommercialTypes[0] || null,
      'train_number'    : train.TrainNumber,

      // modifications to regular schedule
      'route_modified'  : train.RouteModified,
      'track_modified'  : train.TrackModified,
    };

  });

  // TODO: lookup station id in Redis DB to send additional info
  return {
    'station_id' : data.Id,
    'trains'     : trains
  };

};

exports.list = function(stations) {

  return _.map(stations, function(station) {

    return {
      'aliases'    : [],
      'station_id' : station.Id,
      'belgian'    : station.IsBelgianStation,
      'commercial' : station.IsCommercialStation,
      'latitude'   : station.Latitude,
      'longitude'  : station.Longitude,
      'de'         : station.NameDE,
      'en'         : station.NameEN,
      'fr'         : station.NameFR,
      'nl'         : station.NameNL,
    };

  });

};