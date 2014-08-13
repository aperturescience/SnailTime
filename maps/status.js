'use strict';

var _ = require('lodash-node');

exports.mapStatus = function(status) {

  return {
    'mobile': {
      'healty': _.chain(status.Mobile).values().all(function(val) {
        return val === true;
      }).value()
    },
    'website': {
      'healty': _.chain(status.Website).values().all(function(val) {
        return val === true;
      }).value()
    },
    'realtime': {
      'healthy': status.RealTimeDataAvailable
    },
  };

};