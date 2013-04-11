"use strict";

var fs = require("fs"),
    _ = require("underscore");

function CannedResponses(configFile, reloadOnRequest) {
  this.middleware = this.middleware.bind(this);
  this.configFile = configFile;
  this.reloadOnRequest = reloadOnRequest;

  // preload if we are not reloading on every request
  if (!this.reloadOnRequest) {
    this.preload();
  }
}

CannedResponses.prototype.initData = function() {
  this.collection = [];
  this.verbs = {
    "GET": {},
    "PUT": {},
    "POST": {},
    "DELETE": {}
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
  // Look for any route parameter in the URL, ex: /people/:id
  if (url.indexOf(':') >= 0) {
    var params = [];
    var regex = /:(\w+)(?:$|\/)/g;
    var newUrl = url;
    var match;
    while (match = regex.exec(url)) {
      params.push(match[1]);
      // Replace each route parameter in the URL with a regular expression capture group
      var replacement = match[0].replace(":", "").replace(match[1], "(\\w+)");
      newUrl = newUrl.replace(match[0], replacement);
    }
    url = newUrl;
    this.collection.push({ verb: verb, url: url, resp: resp, routeParams: params });
  } else {
    this.collection.push({ verb: verb, url: url, resp: resp });
  }

  this.verbs[verb][url] = resp;
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

    var params = {};

    //if (req.url.indexOf("/animals") >= 0) console.log(req);

    if (req.query) {
      _.extend(params, req.query);
    }

    if (req.body) {
      _.extend(params, req.body);
    }

    // Look for an exact match for the URL first.
    var response = this.verbs[req.method][req.url];

    if (!response) {
      // If no exact match is found, we look for a matching URL using regular expressions
      var match = _.find(this.collection, function(r) {
        if (r.verb != req.method) return false;

        var regexp = new RegExp('^' + r.url + '$');
        var routeMatch = req.url.match(regexp);
        return routeMatch != null;
      });

      if (match) {
        response = match.resp;

        if (typeof response == "function" && match.routeParams) {
          var routeParams = {};
          // Use a regular expession to retrieve the route parameter values and match them to their names.
          var regexp = new RegExp(match.url);
          var values = req.url.match(regexp);
          for (var i = 0; i < match.routeParams.length; i++) {
            routeParams[match.routeParams[i]] = values[i + 1];
          }
          _.extend(params, routeParams);
        }
      }
    }

    if (response) {
      if (typeof response == "function") {
        //TODO: add POST and GET parameters
        res.send(response(params));
      } else {
        res.send(response);
      }
    } else {
      next();
    }
  }.bind(this));
};

module.exports = CannedResponses;
