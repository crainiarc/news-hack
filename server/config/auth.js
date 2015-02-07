var config = {
  facebookAuth : {
    // Remote
    //appId : "1379455339033576",
    //appSecret : "958e77a68d5b8f4ea3448012b1fd7dc2",
    //callbackURL : "http://128.199.157.245:3000/auth/facebook/callback",
    // Localhost
    appId : "1556160834639118",
    appSecret : "823ed6a9762e71baed4484570cb2e22a",
    callbackURL : "http://localhost:9000/auth/facebook/callback",

    scope : [ "email", "user_status", "user_friends", "read_stream"]
  },

  appUrl : "http://localhost:9000",
  postLimit : 250,

  sessionSecret : "allyourfbdataarebelongtous"
};

module.exports = config;
