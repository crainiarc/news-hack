var https = require('https');
var config = require('./config/auth');
var sdk = require('facebook-node-sdk');
var fs = require('fs');
var path = require('path');

var PythonShell = require('python-shell');
var options = {
  mode: 'text',
  pythonPath: '/usr/bin/python',
  pythonOptions: ['-u'],
  scriptPath: config.pyscriptpath,
  args: []
};

var pulldata = function(urls, fb, alldata, res, done) {

  var url = urls.pop();
  console.log(url);
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

      /*
      if (data.hasOwnProperty('paging') &&
        data.paging.hasOwnProperty('next')) {
        urls.unshift(data.paging.next);

        pulldata(urls, fb, alldata, res, done);

      } else if (urls.length > 0) {
        pulldata(urls, fb, alldata, res, done);
      } else {*/
        done(alldata, res);
      //}
    }
  });

};

var saveObjToFile = function(alldata, outputPath) {
  var out = JSON.stringify(alldata);

  fs.writeFileSync(outputPath, out, {encoding:'utf8'}, function(err) {
    if (err) {
      console.log("FS error", err);
    } else {
      console.log("FS done");
    }

  });
};

var fbpull = function(user, res) {
  var fb = new sdk({
    appId : config.facebookAuth.appId,
    secret: config.facebookAuth.appSecret
  }).setAccessToken(user.facebook.token);
  var urls = [
    '/v2.2/me/home?limit=1000&since=2014-01-01',
    '/v2.2/me/home?limit=1000&since=2014-02-01',
    '/v2.2/me/home?limit=1000&since=2014-03-01',
    '/v2.2/me/home?limit=1000&since=2014-04-01',
    '/v2.2/me/home?limit=1000&since=2014-05-01',
    '/v2.2/me/home?limit=1000&since=2014-06-01',
    '/v2.2/me/home?limit=1000&since=2014-07-01',
    '/v2.2/me/home?limit=1000&since=2014-08-01',
    '/v2.2/me/home?limit=1000&since=2014-09-01',
    '/v2.2/me/home?limit=1000&since=2014-10-01',
    '/v2.2/me/home?limit=1000&since=2014-11-01',
    '/v2.2/me/home?limit=1000&since=2014-12-01',
    '/v2.2/me/home?limit=1000&since=2015-01-01'
  ];

  var alldata = pulldata(urls, fb, {}, res,
    function(alldata, res) {

      var dat = new Date();
      var t = dat.getHours() + ':' + dat.getMinutes() + ':' + dat.getSeconds();
      var outputPath = path.join(__dirname, 'newdata', t) + '.txt';

      saveObjToFile(alldata, outputPath);
      options.args = [outputPath];

      var f = function (err, results) {
        if (err) { console.log(err);}
        // results is an array consisting of messages collected during execution 
        console.log('results: %j', results);
        var classify = {};
        console.log("All data");
        console.log(alldata);
        for (var i=0; i<result.length; i++) {
          var l = result.split(' ');
          classify[l[0]] = l.slice(1);
        }
        res.json(alldata);
      }

      PythonShell.run(config.pyscript, options, f);
    });
};

module.exports = fbpull;
