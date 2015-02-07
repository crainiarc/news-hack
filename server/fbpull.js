var https = require('https');
var config = require('./config/auth');
var sdk = require('facebook-node-sdk');
var fs = require('fs');
var path = require('path');

var pulldata = function(url, fb, alldata, res, done) {

  fb.api(url, function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
      return;
    } else {
      var datastring = data.data.map(function(piece) {
        if (piece.hasOwnProperty('id')) {
          alldata[piece.id] = piece;
        }
      });

      if (data.hasOwnProperty('paging') &&
        data.paging.hasOwnProperty('next')) {

        pulldata(data.paging.next, fb, alldata, res, done);

      } else {
        done(alldata, res);
      }
    }
  });

};

var saveObjToFile = function(alldata) {
  var dat = new Date();
  var t = dat.getHours() + ':' + dat.getMinutes() + ':' + dat.getSeconds();

  var outputPath = path.join(__dirname, 'newdata', t) + '.txt';
  var out = JSON.stringify(alldata);

  fs.writeFile(outputPath, out, {encoding:'ascii'}, function(err) {
    if (err) {
      console.log("FS error", err);
    } else {
      console.log("FS done");
    }

  });
};

var pullFriendId = function(fb, res) {
  var ids = [];
  fb.api('/v2.2/me/friends?fields=id', function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
      return;
    } else {

      var urls = ['/v2.2/me/feed?limit=10&fields=comments,message'];
      /*
      data.data.forEach(function(friend) {
        urls.push('/v2.2/'+friend.id+'/feed?limit=10&fields=comments,message');
      });
      */
      ids.forEach(function(id) {
        urls.push('/v2.2/'+id+'/feed?limit=10&fields=comments,message');
      });

      pulldata(urls, fb, res, []);
    }
  });
};

var extractMessages = function(data) {
  res = {};
  if (data.hasOwnProperty(data)) {
    data = data.data;
  }

  data.forEach(function(msg) {
    var m = "";
    if (msg.hasOwnProperty('message')) {
      m += msg.message;
    }

    if (msg.comments) {
      msg.comments.data.forEach(function(cmsg) {
        m += " " + cmsg.message;
      });
    }

    if (m.length !== 0) {
      res[msg.id] = m;
    }
  });

  return res;
};

var pullHome = function(fb, res) {
  console.log("Pulling limit",config.postLimit);
  fb.api('/v2.0/me/home?limit='+ config.postLimit +'&fields=message,comments{message}', function(err, data) {
    if (err) {
      console.log("ERROR");
      res.status(500).send(err);
      return;
    } else {
      res.status(200).json(data);
      return;
    }
  });
};

var fbpull = function(user, res) {
  var fb = new sdk({
    appId : config.facebookAuth.appId,
    secret: config.facebookAuth.appSecret
  }).setAccessToken(user.facebook.token);
  // Get friends id
  var alldata = pulldata('/v2.2/me/home?limit=1&since=2014-01-01', fb, {}, res,
    function(alldata, res) {
      saveObjToFile(alldata);
      res.json(alldata);
    });
};

module.exports = fbpull;
