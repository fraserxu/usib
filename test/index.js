var test = require('tape');
var Usib = require('../index.js');
var exec = require('child_process').exec;

test('Usib module', function(t) {
  t.plan(2);
  t.equal(typeof Usib, 'function');
  t.equal(typeof Usib(), 'object');
});

test('A usib instance', function(t) {
    var usib = new Usib('cca0e9d41a2d7c7');
    t.equal(usib.key, 'cca0e9d41a2d7c7', 'has getKey method.');
    t.equal(typeof usib.getKey, 'function', 'has getKey method.');
    t.equal(typeof usib.setKey, 'function', 'has setKey method.');
    t.equal(typeof usib.upload, 'function', 'has upload method.');
    t.equal(typeof usib.capture, 'function', 'has capture method.');
    child = exec('rm ' + usib.keyloc);
    t.end();
});

test('setKey and getKey', function(t) {
    var usib = new Usib('cca0e9d41a2d7c7');
    t.equal(usib.getKey(), 'cca0e9d41a2d7c7', 'can set a key');
    child = exec('rm ' + usib.keyloc, function(error, stdout, stderr) {
        t.equal(usib.getKey(), 'false', 'return false when without setting key');
    });
    t.end();
});

test('capture', function(t) {
    var usib = new Usib('cca0e9d41a2d7c7');
    var url = 'http://xvfeng.me';
    var imgPath = './usib.png';
    usib.capture(url, imgPath, {}, function(data) {
        t.equal(data, imgPath, 'callback argument should be equal to imgPath');
    });
    t.end();
});
