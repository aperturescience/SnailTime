'use strict';

var     moment = require('moment');

exports.toCET = function(time) {
  return moment(time).zone('+0200');
};