module.exports = function(server) {

  server.get("/people", function(req, res) {
    res.send([
      { name : "Euge" },
      { name : "Bob" } ]);
  });

  server.get("/people/1", function(req, res) {
    res.send({
      name : "Euge",
      address : "1234 Main St."
    });
  });

  server.post("/people", function(req, res) {
    res.send({
      name : "Bob",
      id : 10
    });
  });

  server.put("/people/10", function(req, res) {
    res.send({
      name : "NotBob",
      id : 10
    });
  });

  server.del("/people/10", function(req, res) {
    res.send({});
  });
};