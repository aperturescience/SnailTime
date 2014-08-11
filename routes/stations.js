var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    moment    = require('moment'),
    OAuth     = require('../lib/oauth');

/* GET status */
router.get('/:id([0-9]+)', function(req, res, next) {

  var dateTimeFrom = moment().zone('+01:00').format('YYYY-MM-DD HH:mm:ss');
  var dateTimeTo   = moment().zone('+01:00').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

  var params = {
    'dateTimeFrom'  : dateTimeFrom,
    'dateTimeTo'    : dateTimeTo,
    'searchType'    : 0,
    'stationID'     : req.params.id
  };

  request.get(OAuth('RetrieveStationSchedule', params), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    res.json(body);
  });

});

module.exports = router;
