"use strict";

var fs = require("fs");

function CannedResponses(configFile, preload) {
  this.configFile = configFile;
  this.preload    = preload;
  this.middleware = this.middleware.bind(this);
  
  this.verbs = {
    "GET" : {},
    "PUT" : {},
    "POST" : {},
    "DELETE" : {}
  };
  
  if (this.preload) {
    this.preloadConfigFile();
  }
}

CannedResponses.prototype.load = function(contents) {
  // evaluate and laod the provided contents
  (new Function("canned", "with(canned){ " + contents + "}"))(this);
};

CannedResponses.prototype.get = function(url, resp) {
  this.verbs.GET[url] = resp;
};

CannedResponses.prototype.readConfigFile = function(callback) {
  fs.readFile(this.configFile, function (err, contents) {
    if (err) {
      throw err;
    }
    
    callback(contents.toString());
  });
};

CannedResponses.prototype.preloadConfigFile = function() {
  this.load(fs.readFileSync(this.configFile));
};

CannedResponses.prototype.data = function(method, url, callback) {
  if (this.preload) {
    callback(this.verbs[method][url]);
  } else {
    this.readConfigFile(function(contents) {
      this.load(contents);
      callback(this.verbs[method][url]);
    }.bind(this));
  }
};

CannedResponses.prototype.middleware = function(req, res, next) {  
  this.data(req.method, req.url, function(match) {
    if (match) {
      // serve the pre-configured response if we have a match
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(match));
    } else {
      next();
    }
  });  
};

module.exports = CannedResponses;
