'use strict';

var _ = require('lodash-node');

function isHealthy(prop) {
  return _.chain(prop).values().all(function(val) {
    return val === true;
  }).value();
}

exports.status = function(status) {

  var health = {
    mobile    : isHealthy(status.Mobile),
    website   : isHealthy(status.Website),
    realtime  : status.RealTimeDataAvailable
  };

  health.all = health.mobile && health.website && health.realtime;

  return {
    'all': {
      'healthy': health.all
    },
    'mobile': {
      'healthy': health.mobile
    },
    'website': {
      'healthy': health.website
    },
    'realtime': {
      'healthy': health.realtime
    },
  };

};