"use strict";

var request = require('supertest'),
    canned  = require("../"),
    expect  = require("chai").expect;

describe("CRUD API", function() {

  var server;

  beforeEach(function() {
    server = canned().init(__dirname + "/fixtures/responses.js");
  });

  it("should return all stored canned responses", function(done) {
    request(server)
      .get('/__canned_responses__/data')
      .expect('Content-Type', /json/)
      .expect(200, [
        { verb : "GET",    url : "/people",    resp : [ { name : "Euge" }, { name : "Bob" } ] },
        { verb : "GET",    url : "/people/1",  resp : { name : "Euge", address : "1234 Main St." } },
        { verb : "POST",   url : "/people",    resp : { name : "Bob", id : 10 } },
        { verb : "PUT",    url : "/people/10", resp : { name : "NotBob", id : 10 } },
        { verb : "DELETE", url : "/people/10", resp : {} }
      ], done);
  });

  it("should add a new canned response", function(done) {
    var cannedWidgetsIndex = [ { id : "foo" }, { id : "bar" } ];

    // add a new canned response
    request(server)
      .post('/__canned_responses__/data')
      .send({ verb: 'GET', url : "/widgets", resp : cannedWidgetsIndex })
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          verb: 'GET',
          url : "/widgets",
          resp : cannedWidgetsIndex,
          id : encodeURIComponent("GET-/widgets")
        });

        // verify we can access it
        request(server)
          .get('/widgets')
          .expect(200, cannedWidgetsIndex, done);
      });
  });

  it("should delete an existing canned response", function(done) {
    // delete a canned response
    request(server)
      .del('/__canned_responses__/data/' + encodeURIComponent("GET-/people"))
      .end(function(err, res) {
        expect(res.status).to.equal(200);

        // verify we can't access it anymore
        request(server)
          .get('/people')
          .expect(404, done);
      });
  });
});

describe("Actual canned responses", function() {

  var server;

  before(function() {
    server = canned().init(__dirname + "/fixtures/responses.js");
  });

  describe("should respond with a 200 when there is a match", function(){

    it("GET", function(done) {
      request(server)
        .get('/people')
        .expect('Content-Type', /json/)
        .expect(200, [ { name : "Euge" }, { name : "Bob" } ], done);
    });

    it("POST", function(done) {
      request(server)
        .post('/people')
        .send({ name : "Bob" })
        .expect('Content-Type', /json/)
        .expect(200, { name : "Bob", id : 10 }, done);
    });

    it("PUT", function(done) {
      request(server)
        .put('/people/10')
        .send({ name : "NotBob" })
        .expect('Content-Type', /json/)
        .expect(200, { name : "NotBob", id : 10 }, done);
    });

    it("DELTE", function(done) {
      request(server)
        .del('/people/10')
        .expect('Content-Type', /json/)
        .expect(200, { }, done);
    });
  });

  it("should respond with a 404 when there is no match", function(done) {
    request(server)
      .get('/not_here')
      .expect(404, done);
  });


});

