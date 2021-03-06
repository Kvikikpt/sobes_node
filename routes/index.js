const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('This is api server. You need to make post request to one of this api:\n api/...!')
});

module.exports = router;
