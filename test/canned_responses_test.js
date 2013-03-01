"use strict";

var CannedResponses = require("../lib/canned_responses"),
    expect          = require("chai").expect;

describe("CRUD", function() {

  var crud;

  beforeEach(function() {
    crud = new CannedResponses(__dirname + "/fixtures/crud.js");
  });

  it("should read in a config file", function() {
    expect(crud.collection.length).to.equal(4);
  });

  it("should allow creation", function() {
    crud.add("GET", "/stuff", {
      id : 10
    });

    expect(crud.collection.length).to.equal(5);
  });

  it("should allow deletions", function() {
    crud.remove("GET", "/people");
    crud.remove("POST", "/people");

    expect(crud.collection.length).to.equal(2);
  });

});


