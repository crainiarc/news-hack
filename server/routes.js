/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var configAuth = require('./config/auth');
var fbpull = require('./fbpull');

module.exports = function(app, passport) {
  console.log("ENTERING PASSPORT");

  // Insert routes below
  app.use('/api/things', require('./api/thing'));

  // Facebook Auth ------------------------------------------------------------
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope : configAuth.facebookAuth.scope
  }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',passport.authenticate('facebook', {
    successRedirect : '/#/newsfeed',
    failureRedirect : '/'
  }));

  // Profile ------------------------------------------------------------------

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log("Login check");
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // FB data pull -------------------------------------------------------------

  app.get('/pullmoidata', function(req, res) {
    fbpull(req.user, res);
  });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });


};
