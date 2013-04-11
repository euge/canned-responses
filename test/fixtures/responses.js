get("/people", [ 
  { name : "Euge" }, 
  { name : "Bob" } 
]);

get("/people/1", {
  name : "Euge",
  address : "1234 Main St."
});

post("/people", {
  name : "Bob",
  id : 10
});

put("/people/10", {
  name : "NotBob",
  id : 10
});

del("/people/10", {});

get("/people/:id", function(params) { return params; });

get("/people/:name/:id", function(params) { return params; });

post("/animals.*", function(params) { return params; });

get("/animals?.*", function(params) { return params; });