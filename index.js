#!/usr/bin/env node

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

var args = process.argv.slice(2),
    argslen = args.length;

module.exports = Usib;

/**
 * Create usib object.
 * @param {string} key imgur key
 */
function Usib(key) {
  if (!(this instanceof Usib)) return new Usib(key);

  this.keyloc = process.env.HOME + '/.imgurkey';
  if(key) this.setKey(key, true);
}

/**
 * Get saved API key (~/.imgurkey)
 * @return {[type]} [description]
 */
Usib.prototype.getKey = function() {
  if (!fs.existsSync(this.keyloc)) {
    return false;
  }

  return fs.readFileSync(this.keyloc, 'utf8').replace(/[\n\r\t\s]/gm, '');
}

/**
 * Set an API Key
 * @param {string} key imgur key
 * @param {bollean} persist true
 */
Usib.prototype.setKey = function(key, persist) {
  if (!key) { return; }
  this.key = key;
  if (persist) {
    fs.writeFileSync(this.keyloc, this.key, 'utf8');
  }
}

/**
 * take a screenshot with the given url
 * @param  {string}   url    page url
 * @param  {string}   imgPath the
 * @param  {object}   options   screen options
 * @return {string}   file   the path to the img
 */
Usib.prototype.capture = function(url, imgPath, opts, callback) {
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
 * upload img
 * @param  {string} file loaction to the image
 * @return {string} data url
 */
Usib.prototype.upload = function(file, callback) {
  imgur.setClientID(this.key);
  imgur.upload(file, function(err, res) {
    if(err) console.log(clc.red(err));
    console.log(clc.green('Your img url is: ' + res.data.link));
    if (callback) callback(res.data.link);
  });
}

// Commandline use
if (argslen) {
  var key = '';
  var usib = new Usib();

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
    usib.upload(file);
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
    usib.capture(url, imgPath, opts, function() {
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
      usib.upload(imgPath, function(url) {
        child = exec('open ' + url, function(error, stdout, stderr) {
          if(error) return console.log(clc.red(error));
        });
      });
    });
    return;
  }
}

