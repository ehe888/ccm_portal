var express = require('express');
var router = express.Router();
var urljoin = require("url-join")
var config = require("../utils/config");
var _ = require("lodash")
  ,debug = require("debug")("wxapi")
  ,template = require("es6-template-strings")
  ,rp = require("request-promise");

var CCMAUTH_ACCESS_TOKEN_URL = urljoin(config.apiHome, "/identity/oauth2admin/token");
var CCMAUTH_REGISTER_ACCOUNT_URL = urljoin(config.apiHome, "/identity/register?authub_account=authub_master");

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log("request form: ", req.body);
  //1. try to get access token before register, TODO: use access token module
  var targetUrl = template(CCMAUTH_ACCESS_TOKEN_URL, { });
  var rpOptions = {
      uri: targetUrl,
      method: "POST",
      headers: {
        'X-Authub-Account': 'authub_master'
      },
      form: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "client_credential"
      },
      json: true
  };

  rp(rpOptions)
    .then(function(data){

      if(data.success){
        var token = data.access_token;
        //register user call
        var targetUrl = template(CCMAUTH_REGISTER_ACCOUNT_URL, { });
        rp({
          uri: targetUrl,
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token
          },
          form: {
            name: req.body.name,
            username: req.body.email,
            password: req.body.password,
            email: req.body.email,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            fullName: req.body.fullName,
            mobile: req.body.mobile
          },
          json: true
        })
        .then(function(data){
          return res.json({
            success: true,
            data: data
          });
        })
        .catch(function(err){
          console.error(err);
          throw err;
        })
      }else{
        return res.json({
          success: false,
          errMsg: "can_not_get_valid_access_token" 
        });
      }
    })
    .catch(function(err){
      console.error(err);
      return res.json({
        success: false,
        error: err
      });
    });
});

module.exports = router;
