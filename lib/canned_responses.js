"use strict";

var fs      = require("fs"),
    _       = require("underscore"),
    express = require("express"),
    methods = require("methods");

var defaultIndexContent = '\
  <html>\
    <body>\
      CannedResponses Landing Page!\
    </body>\
  </html>';

function CannedResponses(configFile, indexRouteCallback) {
  this.configFile         = configFile;
  this.indexRouteCallback = indexRouteCallback;
  _.bindAll(this, "middleware");
  this.createServer();
}

CannedResponses.prototype.createServer = function() {
  this.server = express();
  this.server.use(express.logger("dev"));
  this.server.use(express.bodyParser());
  this.server.use(this.middleware);
};

CannedResponses.prototype.processContents = function(contents) {
  (new Function("server", "with(server) { " + contents + "}"))(this.server);
};

CannedResponses.prototype.loadRoutes = function(done) {
  this.loadIndexRoute();

  fs.readFile(this.configFile, function(err, contents) {
    this.processContents(contents);
    done();
  }.bind(this));
};

// clear all routes
CannedResponses.prototype.clearRoutes = function() {
  methods.forEach(function(m) {
    this.server.routes[m] = [];
  }.bind(this));
};

CannedResponses.prototype.loadIndexRoute = function() {
  var callback = this.indexRouteCallback || function(req, res) {
    res.send(defaultIndexContent);
  };

  // register index route
  this.server.get("/", callback);
};

// middleware to dynamically clear and add routes
CannedResponses.prototype.middleware = function(req, res, next) {
  this.clearRoutes();
  this.loadRoutes(next);
};

module.exports = CannedResponses;
