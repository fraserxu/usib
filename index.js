/**
 * Module depedencies.
 */
var imgur = require('imgur-node-api'),
    screenshot = require('url-to-screenshot'),
    exec = require('child_process').exec,
    clc = require('cli-color'),
    fs = require('fs'),
    path = require('path'),
    child;

var imgName = 'caonima.png',
    clientId = process.argv[3] || 'cca0e9d41a2d7c7',
    imgUrl = process.argv[2];

imgur.setClientID(clientId);

screenshot(imgUrl)
  .width(1024)
  .capture(function(err, img) {
    if (err) throw err;
    fs.writeFile(__dirname + '/' + imgName, img, function(err) {
      if (err) throw err;
      imgur.upload(path.join(__dirname, imgName), function(err, res) {
        child = exec('open ' + res.data.link, function(error, stdout, stderr) {
          if(error) return console.log(clc.red(error));
          console.log(clc.green('Your img url is: ' + res.data.link));
        });
      });
    });
  });

