'use strict';

var _ = require('lodash-node');

function isHealthy(prop) {
  return _.chain(prop).values().all(function(val) {
    return val === true;
  }).value();
}

exports.status = function(status) {

  var mHealthy  = isHealthy(status.Mobile);
  var wHealthy  = isHealthy(status.Website);
  var rHealthy  = status.RealTimeDataAvailable;

  return {
    'all': {
      'healthy': mHealthy && wHealthy && rHealthy
    },
    'mobile': {
      'healthy': mHealthy
    },
    'website': {
      'healthy': wHealthy
    },
    'realtime': {
      'healthy': rHealthy
    },
  };

};