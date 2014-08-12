/**
 * Returns on oauth object to be used with Request
 */

'use strict';

var config    = require('../config.json'),
  querystring = require('querystring');

exports.createOAuthObject = function(url, params) {

  if (url.indexOf('://') === -1)
    url = config.third_party.railtime.endpoint + url;

  return {
    consumer_key    : process.env.RAILTIME_CONSUMER_KEY,
    consumer_secret : process.env.RAILTIME_CONSUMER_SECRET,
    url             : url + '?' + querystring.stringify(params)
  };

};

module.exports = function(url, params) {

  var oauth = exports.createOAuthObject(url, params);

  return {
    url   : oauth.url,
    oauth : oauth,
    params: params,
    json  : true // RailTime doesn't return "application/json" resource type
  };

};