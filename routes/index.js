var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fastccm.com 欢迎您使用' });
});

module.exports = router;
