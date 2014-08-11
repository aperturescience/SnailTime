var express   = require('express'),
    request   = require('request'),
    router    = express.Router(),
    OAuth     = require('../lib/oauth');

/* GET status */
router.get('/', function(req, res, next) {

  request.get(OAuth('RetrieveStatus'), function(err, resp, body) {

    if (err || resp.statusCode !== 200)
      return res.send(resp.statusCode || 500, { error: '¯\\_(ツ)_/¯' });

    res.json(body);
  });

});

module.exports = router;
