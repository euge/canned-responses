"use strict";

var fs = require("fs"),
    _ = require("underscore");

function CannedResponses(configFile, reloadOnRequest) {
  this.middleware      = this.middleware.bind(this);
  this.configFile      = configFile;
  this.reloadOnRequest = reloadOnRequest;

  // preload if we are not reloading on every request
  if (!this.reloadOnRequest) {
    this.preload();
  }
}

CannedResponses.prototype.initData = function() {
  this.collection = [];
  this.verbs = {
    "GET" : {},
    "PUT" : {},
    "POST" : {},
    "DELETE" : {}
  };
};

CannedResponses.prototype.processContents = function(contents) {
  (new Function("canned", "with(canned){ " + contents + "}"))(this);
};

CannedResponses.prototype.preload = function() {
  this.initData();
  this.processContents(fs.readFileSync(this.configFile));
};

CannedResponses.prototype.load = function(done) {
  if (this.reloadOnRequest) {
    fs.readFile(this.configFile, function(err, contents) {
      this.initData();
      this.processContents(contents);
      done();
    }.bind(this));
  } else {
    done();
  }
};

CannedResponses.prototype.add = function(verb, url, resp) {
  this.verbs[verb][url] = resp;
  this.collection.push({ verb : verb, url : url, resp : resp });
};

CannedResponses.prototype.remove = function(verb, url) {
  var resp = this.verbs[verb][url];

  if (!resp) {
    throw new Error(verb + " / " + url + " does not exist");
  } else {
    delete this.verbs[verb][url];
    this.collection = _.reject(this.collection, function(item) {
      return (item.verb == verb && item.url == url);
    });
  }
};

CannedResponses.prototype.get = function(url, resp) {
  this.add("GET", url, resp);
};

CannedResponses.prototype.post = function(url, resp) {
  this.add("POST", url, resp);
};

CannedResponses.prototype.del = function(url, resp) {
  this.add("DELETE", url, resp);
};

CannedResponses.prototype.put = function(url, resp) {
  this.add("PUT", url, resp);
};

CannedResponses.prototype.middleware = function(req, res, next) {
  this.load(function() {
    var match = this.verbs[req.method][req.url];

    if (match) {
      // serve the pre-configured response if we have a match
      res.send(match);
    } else {
      next();
    }
  }.bind(this));
};

module.exports = CannedResponses;
