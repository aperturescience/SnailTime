'use strict';

var _       = require('lodash-node'),
    moment  = require('moment');

exports.mapStation = function(data, locale) {

  locale = locale || null;

  var trains = _.map(data.Trains, function(train) {

    return {
      'arrival'         : moment(train.ArrivalDateTime).zone('+0200').toISOString() || null,
      'arrival_str'     : (function() {
        return train.ArrivalDateTime === null
          ? null
          : moment(train.ArrivalDateTime).locale(locale).zone('+0200').fromNow();
      })(),
      'arrival_delay'   : train.ArrivalDelay,
      'has_arrived'     : train.ArrivalDetected,

      'departure'       : moment(train.DepartureDateTime).zone('+0200').toISOString() || null,
      'departure_str'   : (function() {
        return train.DepartureDateTime === null
          ? null
          : moment(train.DepartureDateTime).locale(locale).zone('+0200').fromNow();
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
    'id'      : data.Id,
    'trains'  : trains
  };

};