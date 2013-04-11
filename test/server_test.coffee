"use strict"

request = require 'supertest'
canned = require "../"
expect = require("chai").expect

describe "CRUD API", ->

  server = null

  beforeEach ->
    server = canned().init "#{__dirname}/fixtures/responses.js"

  it "should return all stored canned responses", (done) ->
    request(server)
      .get('/__canned_responses__/data')
      .expect('Content-Type', /json/)
      .expect(200, [
        (verb : "GET",    url : "/people",    resp : [ { name : "Euge" }, { name : "Bob" } ]),
        (verb : "GET",    url : "/people/1",  resp : { name : "Euge", address : "1234 Main St." }),
        (verb : "POST",   url : "/people",    resp : { name : "Bob", id : 10 }),
        (verb : "PUT",    url : "/people/10", resp : { name : "NotBob", id : 10 }),
        (verb : "DELETE", url : "/people/10", resp : {}),
        (verb : "GET",    url : "/people/(\\w+)",        routeParams : ["id"]),
        (verb : "GET",    url : "/people/(\\w+)/(\\w+)", routeParams : ["name", "id"]) ,
        (verb : "POST",   url : "/animals.*"),
        (verb : "GET",    url : "/animals?.*"),
      ], done)

  it "should add a new canned response", (done) ->
    cannedWidgetsIndex = [ { id : "foo" }, { id : "bar" } ]
    
    # add a new canned response
    request(server)
      .post('/__canned_responses__/data')
      .send(verb: 'GET', url : "/widgets", resp : cannedWidgetsIndex)
      .end (err, res) ->
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal
          verb: 'GET',
          url : "/widgets",
          resp : cannedWidgetsIndex,
          id : encodeURIComponent("GET-/widgets")

        #verify we can access it
        request(server)
          .get('/widgets')
          .expect(200, cannedWidgetsIndex, done)

  it "should delete an existing canned responese", (done) ->
    # delete a canned response
    request(server)
      .del('/__canned_responses__/data/' + encodeURIComponent("GET-/people"))
      .end (err, res) ->
        expect(res.status).to.equal(200);

        # verify we can't access it anymore
        request(server)
          .get('/people')
          .expect(404, done);



describe "Actual canned responses", ->
  server = null
  
  before ->
    server = canned().init "#{__dirname}/fixtures/responses.js"

  describe "with a match", ->

    it "works with a GET", (done) ->
      request(server)
        .get('/people')
        .expect('Content-Type', /json/)
        .expect(200, [ { name : "Euge" }, { name : "Bob" } ], done)

    it "works with a POST", (done) ->
      request(server)
        .post('/people')
        .send(name : "Bob")
        .expect('Content-Type', /json/)
        .expect(200, name : "Bob", id : 10, done);

    it "works with a DELETE", (done) ->
      request(server)
        .del('/people/10')
        .expect('Content-Type', /json/)
        .expect(200, { }, done)

    it "works with a PUT", (done) ->
      request(server)
        .put('/people/10')
        .send(name : "NotBob")
        .expect('Content-Type', /json/)
        .expect(200, name : "NotBob", id : 10, done);

    it "works with a route parameter", (done) ->
      request(server)
        .get('/people/15')
        .expect('Content-Type', /json/)
        .expect(200, { id: '15' }, done)

    it "works with two route parameters", (done) ->
      request(server)
        .get('/people/Euge/3')
        .expect('Content-Type', /json/)
        .expect(200, { name: 'Euge', id: '3' }, done)

    it "passes POST data as parameters", (done) ->
      request(server)
        .post('/animals')
        .send(name : "Rex")
        .expect('Content-Type', /json/)
        .expect(200, { name : "Rex" }, done);

    it "passes query string parameters", (done) ->
      request(server)
        .get('/animals?type=dog')
        .expect('Content-Type', /json/)
        .expect(200, { type : "dog" }, done);

    it "passes POST data as form values", (done) ->
      request(server)
        .post('/animals')
        .field("name", "Rex")
        .expect('Content-Type', /json/)
        .expect(200, { name : "Rex" }, done);

    it "picks form values before query string parameters", (done) ->
      request(server)
        .post('/animals?name=Query')
        .field("name", "Field")
        .expect('Content-Type', /json/)
        .expect(200, { name : "Field" }, done);

    it "picks body data before query string parameters", (done) ->
      request(server)
        .post('/animals?name=Query')
        .send(name: "Body")
        .expect('Content-Type', /json/)
        .expect(200, { name : "Body" }, done);

  describe "without a match", ->

    it "should get a 404", (done) ->
      request(server).
        get("/not_here").
        expect(404, done)


