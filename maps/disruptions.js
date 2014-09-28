'use strict';

var _         = require('lodash-node'),
    datetime  = require('../utils/datetime');

exports.disruption = function(disruptions) {

  // TODO: Convert ASP.Net date to ISO standard
  return _.map(disruptions, function(disruption) {

    return {
      'id': parseInt(disruption.Id),
      'priority': disruption.Priority,
      'date': datetime.toCET(disruption.DateTime).toISOString(),
      'title': disruption.Title.trim(),
      'cause': disruption.Cause.trim(),
      'consequence': disruption.Consequence.trim(),
      'solution': disruption.Solution.trim() || null,
      'status': disruption.Status
    };

  });

};