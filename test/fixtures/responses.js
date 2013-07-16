get("/people", function(req, res) {
  res.send([
    { name : "Euge" },
    { name : "Bob" } ]);
});

get("/people/1", function(req, res) {
  res.send({
    name : "Euge",
    address : "1234 Main St."
  });
});

post("/people", function(req, res) {
  res.send({
    name : "Bob",
    id : 10
  });
});

put("/people/10", function(req, res) {
  res.send({
    name : "NotBob",
    id : 10
  });
});

del("/people/10", function(req, res) {
  res.send({});
});
