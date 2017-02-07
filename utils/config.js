var assert = require("assert");
var path = require('path');
var env = process.env.NODE_ENV;
assert(env, "CONFIG ERROR: No NODE_ENV has been set!")
var config = require(path.join(__dirname, '..', 'config', 'config.' + env + '.json'));

module.exports = config;
