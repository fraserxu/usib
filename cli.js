#!/usr/bin/env node

/**
 * Module depedencies.
 */
var Usib = require('./usib')
    , clc = require('cli-color')
    , optimist = require('optimist')
;

var argv = optimist
    .usage('Usage: $0 -h/k/u/c/cu opts')
    .options({
      'k': {
        description: 'imgur key'
      },
      'u': {
        description: 'path to the image'
      },
      'c': {
        description: 'page url to capture',
      },
      'a': {
        description: 'capture and upload with given url'
      }
    })
    .argv
;

if (argv.h) {
  optimist.showHelp();
}

// set key
if (argv.k) {
  var usib = new Usib(argv.k);
  console.log(clc.green('Key set to ' + argv.k));
  return;
}

// upload local image
if (argv.u) {
  var usib = new Usib();
  var key = usib.getKey();
  if (!key) {
    console.log(clc.yellow('Please specify a key, e.g: usib -k <key>\n\nIf you don\'t have one get one at get one at http://imgur.com/register/api_anon'));
    return;
  }

  usib.setKey(key);
  usib.upload(argv.u, function(link) {
    console.log(clc.green('Image upload success to %s', link));
    return;
  });
}

// capture a page with given url
if (argv.c) {
  var usib = new Usib();
  var key = usib.getKey();
  if (!key) {
    console.log(clc.yellow('Please specify a key, e.g: usib -k <key>\n\nIf you don\'t have one get one at get one at http://imgur.com/register/api_anon'));
    return;
  }

  usib.setKey(key);
  var imgPath = argv.p || './usib.png';
  usib.capture(argv.c, imgPath, {}, function(data) {
      console.log('Save image to ' + imgPath);
      return;
  });
}

// capture and upload
if (argv.a) {
  var usib = new Usib();
  var key = usib.getKey();
  if (!key) {
    console.log(clc.yellow('Please specify a key, e.g: usib -k <key>\n\nIf you don\'t have one get one at get one at http://imgur.com/register/api_anon'));
    return;
  }

  usib.setKey(key);
  var imgPath = argv.p || './usib.png';
  usib.capture(argv.a, imgPath, {}, function(imgPath) {
    console.log(clc.green('Saved img to %s', imgPath));
    usib.upload(imgPath, function(link) {
      console.log(clc.green('Image upload success to %s', link));
      return;
    });
  });
}
