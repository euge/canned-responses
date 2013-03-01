"use strict";

var CannedResponses = require("./canned_responses"),
    express         = require("express"),
    _               = require("underscore");

module.exports = function() {

  var server = express();

  server.use(express.bodyParser());

  // static assets
  server.use("/__canned_responses__/assets", express.static(__dirname + "/assets"));

  // list all canned responses
  server.get("/__canned_responses__/data", function(req, res) {
    res.send(server._cannedResponses.collection);
  });

  // create a new canned response
  server.post("/__canned_responses__/data", function(req, res) {
    server._cannedResponses.add(req.body.verb, req.body.url, req.body.resp);

    var id   = encodeURIComponent(req.body.verb + "-" + req.body.url),
        resp = _.extend(req.body, { id : id });

    res.send(resp);
  });

  // delete a canned response
  server.del("/__canned_responses__/data/:verb-:url", function(req, res) {
    server._cannedResponses.remove(req.param("verb"), req.param("url"));
    res.send({});
  });

  // inserts the CannedResponses middleware
  server.init = function(configFile) {
    this._cannedResponses = new CannedResponses(configFile);
    this.use(this._cannedResponses.middleware);
    return this;
  };

  return server;
};