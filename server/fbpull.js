var https = require('https');
var config = require('./config/auth');
var sdk = require('facebook-node-sdk');
var fs = require('fs');
var path = require('path');

var PythonShell = require('python-shell');
var options = {
  mode: 'text',
  pythonPath: 'python3',
  pythonOptions: ['-u'],
  scriptPath: __dirname+config.pyscriptpath,
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

      if (data.hasOwnProperty('paging') &&
        data.paging.hasOwnProperty('next')) {
        urls.unshift(data.paging.next);

        pulldata(urls, fb, alldata, res, done);

      } else if (urls.length > 0) {
        pulldata(urls, fb, alldata, res, done);
      } else {
        done(alldata, res);
      }
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
    '/v2.2/me/home?limit=2&since=2015-01-01'
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
        console.log('results: %j', results[0]);

        res.json(results[0]);
      };

      PythonShell.run(config.pyscript, options, f);
    });
};

module.exports = fbpull;
