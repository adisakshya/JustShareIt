var express = require('express');
var router = express.Router();

/* GET admin home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Admin' });
});

module.exports = router;
