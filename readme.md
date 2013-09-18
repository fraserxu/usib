## url-screenshot-imgur-browser

[![Build Status](https://travis-ci.org/fraserxu/usib.png?branch=master)](https://travis-ci.org/fraserxu/usib)

A command line tool to **Add a url, take a screenshot, upload to imgur, and open in the browser.**

![Hi, I'm caonima](https://raw.github.com/fraserxu/usib/master/caonima.jpg)


### Installation

    npm install -g usib


### Command-line Usage:

**You must set an API key before CLI use; get one at http://imgur.com/register/api_anon**

Set your API key once and forget it (saved to ~/.imgurkey)

    node ./cli.js -k aCs53GSs4tga0ikp

Upload a local image

    node ./cli.js -u caonima.jpg

Capture a page with given url

    node ./cli.js -c http://xvfeng.me

Capture and Upload and Open in a browser

    node ./cli.js -a http://xvfeng.me


### Requirements
* [phantomjs](http://phantomjs.org/download.html) `brew update && brew install phantomjs`
* [imgur api_key](https://imgur.com/register/api_anon) set the imgur client_id

### Liscense:

WTFPL