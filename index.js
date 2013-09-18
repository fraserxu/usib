/**
 * Module depedencies.
 */
var imgur = require('imgur-node-api'),
    screenshot = require('url-to-screenshot'),
    clc = require('cli-color'),
    fs = require('fs');

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
