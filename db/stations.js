'use strict';

var redis   = require('redis'),
    client  = redis.createClient(),
    _       = require('lodash-node'),
    leven   = require('leven');

exports.byId = function(id, callback) {
  client.hgetall('station:' + id, function(err, station) {
    if (err)
      callback(err);
    else
      callback(null, exports.deserialize(station));
  });
};

exports.deserialize = function(object) {

  _.forOwn(object, function(v, k) {

    try {
      object[k] = JSON.parse(v);
    } catch(e) {
      object[k] = v; // JSON parsing failed, probably not a stringified object
    }

  });

  return object;
};

/**
 * Lookup the ID of a train station based on the Levenshtein distance algo
 */
exports.levenLookup = function(needle, limit, callback) {

  // limit parameter is optional
  if (typeof limit === 'function') {
    callback = limit;
    limit = 1;
  }

  client.HGETALL(['station:names'], function(err, stations) {

    if (err)
      return callback(err);

    var results = [];

    // itterate over stations to find lowest levenshtein distance string
    _.forOwn(stations, function(id, station) {
      var score = leven(needle, station);

      // manipulate the score for stations beginning with the specified needle
      // e.g gent -> gent-sint-pieters, gent-dampoort, ...
      if (station.indexOf(needle) === 0) {
        score = 0;
      }

      // if the score is larger than 5, it's probably nonsense
      if (score < 5 ) {
        results.push({
          score: score,
          id: parseInt(id),
          station: station
        });
      }
    });

    // return as a single object
    if (limit === 1)
      return callback(null, _.min(results, 'score'));
    // return as an array
    else
      return callback(null, _.first(_.sortBy(results, ['score', 'station']), limit));
  });

};
