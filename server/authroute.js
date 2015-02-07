var configAuth = require('./config/auth');
var express= require('express');
var router = express.Router();

module.exports = function(passport) {

  // Facebook Auth ------------------------------------------------------------
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope : configAuth.facebookAuth.scope
  }));

  // handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback',passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  return router;
};
