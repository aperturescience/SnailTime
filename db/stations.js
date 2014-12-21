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
exports.levenLookup = function(needle, callback) {

  client.HGETALL(['station:names'], function(err, stations) {

    if (err)
      return callback(err);

    var results = [];

    // itterate over stations to find lowest levenshtein distance string
    _.forOwn(stations, function(id, station) {
      var score = leven(needle, station);
      if (score < 5 ) // if the score is larger than 5, it's probably nonsense
        results.push({ score: score, id: id, station: station });
    });

    return callback(null, _.min(results, 'score'));
  });

};
