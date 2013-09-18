#!/usr/bin/env node

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
    console.log('file path is ' + file);
    usib.upload(file, function(link) {
      console.log(clc.green('Image upload success to %s', link));
    });
    return;
  }

  // Capture a page and save it to local
  if (args[0] === '-c') {
    if (typeof args[1] === 'undefined') {
      console.log(clc.yellow('Please specify a path the file, e.g: usib -u <file>'));
      return;
    }

    url = args[1];
    var imgPath = './usib.png';
    var opts = {};
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
    var imgPath = './usib.png';
    var opts = {};
    console.log(clc.green('Tring to capture the page...'));
    usib.capture(url, imgPath, opts, function(imgPath) {
      console.log(clc.green('Saved img to %s', imgPath));
      usib.upload(imgPath, function(link) {
        console.log(clc.green('Image upload success to %s', link));
        child = exec('open ' + link, function(error, stdout, stderr) {
          if(error) return console.log(clc.red(error));
        });
      });
    });
    return;
  }
}

