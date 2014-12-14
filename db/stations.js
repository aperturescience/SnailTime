'use strict';

var redis   = require('redis'),
    client  = redis.createClient(),
    _       = require('lodash-node');

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
