"use strict";

var connect = require("connect"),
    request = require('supertest'),
    CannedResponses = require("../");

var app    = connect(),
    canned = new CannedResponses("test/fixtures/responses.js", true);
    
app.use(canned.middleware);

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