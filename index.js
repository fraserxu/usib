#!/usr/bin/env node

/**
 * Module depedencies.
 */
var imgur = require('imgur-node-api'),
    screenshot = require('url-to-screenshot'),
    exec = require('child_process').exec,
    clc = require('cli-color'),
    fs = require('fs'),
    path = require('path')
    child;

var args = process.argv.slice(2),
    argslen = args.length;

var usib = (function() {

  var _key = '',
      _keyloc = process.env.HOME + '/.imgurkey';

  // Get saved API key (~/.imgurkey)
  function _getKey () {
      // Synchronous since nothing can happen without it
      if (!fs.existsSync(_keyloc)) {
          return false;
      }

      return fs.readFileSync(_keyloc, 'utf8').replace(/[\n\r\t\s]/gm, '');
  }

  // Set an API key
  function _setKey (key, persist) {
      if (!key) { return; }
      _key = key;
      exports.key = key;
      if (persist) {
          fs.writeFile(_keyloc, key, 'utf8', function (err) {
              if (err) {
                  throw err;
              }
          });
      }
  }

  /**
   * take a screenshot with the given url
   * @param  {string}   url    page url
   * @param  {string}   imgPath the
   * @param  {object}   options   screen options
   * @return {string}   file   the path to the img
   */
  function _capture (url, imgPath, opts, callback) {
    screenshot(url, opts)
      .capture(function(err, img) {
        if (err) throw err;
        fs.writeFile(imgPath, img, function(err) {
          if (err) throw err;
          if (callback) callback(imgPath);
        });
      });
  }

  /**
   * upload img and open in the browser
   * @param {string} api_key for imgur
   * @param  {string} file loaction to the image
   */
  function _upload (file, api_key) {
    imgur.setClientID(api_key);
    imgur.upload(file, function(err, res) {
      child = exec('open ' + res.data.link, function(error, stdout, stderr) {
        if(error) return console.log(clc.red(error));
        console.log(clc.green('Your img url is: ' + res.data.link));
      });
    });
  }

  return {
    'getKey': _getKey,
    'setKey': _setKey,
    'upload': _upload,
    'capture': _capture
  };

}());

exports = {
  getKey : usib.getKey,
  setKey: usib.setKey,
  upload: usib.upload,
  capture: usib.capture
}


// Commands
if (argslen) {
  var key = '';

  // Check if key is being set via cli
  if (args[0] === '-k') {
      if (typeof args[1] === 'undefined') {
          console.log(clc.yellow('Please specify a key, e.g: usib -k <key>'));
          return;
      }

      key = args[1] ;
      usib.setKey(key, true);
      console.log(clc.green('Key set to %s', key));
      return;
  }

  key = usib.getKey();

  if (!key) {
      console.log(clc.yellow('Please specify a key, e.g: usib -k <key>\n\nIf you don\'t have one get one at get one at http://imgur.com/register/api_anon'));
      return;
  }

  // Upload a local img with a give path
  if (args[0] === '-u') {
    if (typeof args[1] === 'undefined') {
        console.log(clc.yellow('Please specify a path the file, e.g: usib -u <file>'));
        return;
    }

    file = args[1];
    usib.upload(file, key);
    return;
  }

  // Capture a page and save it to local
  if (args[0] === '-c') {
    if (typeof args[1] === 'undefined') {
        console.log(clc.yellow('Please specify a path the file, e.g: usib -u <file>'));
        return;
    }

    url = args[1];
    if(argslen >= 2) var imgPath = args[2] || './usib.png';
    if(argslen >= 3) var opts = args[3] || {};
    console.log(clc.green('Tring to capture the page...'));
    usib.capture(url, imgPath, opts, function(imgPath) {
      console.log(clc.green('Saved img to %s', imgPath));
    });
    return;
  }

  // Capture && Upload
  if (args[0] === '-cu') {
    if (typeof args[1] === 'undefined') {
        console.log(clc.yellow('Please specify a path the file, e.g: usib -u <file>'));
        return;
    }

    url = args[1];
    if(argslen >= 2) var imgPath = args[2] || './usib.png';
    if(argslen >= 3) var opts = args[3] || {};
    console.log(clc.green('Tring to capture the page...'));
    usib.capture(url, imgPath, opts, function(imgPath) {
      console.log(clc.green('Saved img to %s', imgPath));
      usib.upload(imgPath, key);
    });
    return;
  }
}

