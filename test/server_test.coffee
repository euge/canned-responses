"use strict"

request = require 'supertest'
canned  = require "../"
expect  = require("chai").expect

describe "Actual canned responses", ->
  server = null
  
  before ->
    server = canned("#{__dirname}/fixtures/responses.js").server

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

  describe "without a match", ->

    it "should get a 404", (done) ->
      request(server).
        get("/not_here").
        expect(404, done)


