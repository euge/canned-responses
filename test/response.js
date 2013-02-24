"use strict";

var connect = require("connect"),
    request = require('supertest'),
    Playback = require("../");

var app      = connect(),
    playback = new Playback("test/fixtures/responses.js", true);
    
app.use(playback.middleware);

describe("Responses", function() {
  
  it("should respond with JSON when there is a match", function(done) {
    request(app)
      .get('/people')
      .expect('Content-Type', /json/)
      .expect(200, [ { name : "Euge" }, { name : "Bob" } ], done);
  });
  
  it("should respond with a 404 when there is no match", function(done) {
    request(app)
      .get('/not_here')
      .expect(404, done);
  });
  
});