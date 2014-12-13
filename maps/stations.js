'use strict';

var _         = require('lodash-node'),
    datetime  = require('../utils/datetime');

exports.station = function(data, locale) {

  locale = locale || null;

  var trains = _.map(data.Trains, function(train) {

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

  // TODO: lookup station id in Redis DB to send additional info
  return {
    'id'         : data.Id,
    'trains'     : trains
  };

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